import express from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Notes from '../models/note.model';
import { validateTabInput } from '../inputValidation';



router.get('/getTabs',auth,  async(req, res) => {

    try {
        const userId = req.headers["userId"];

        const allOpenTabs = await Notes.find(
           {userId: userId , isOpen: true},
           {userId: 0, isOpen: 0, __v: 0}
        )
        
        if (allOpenTabs){
            return res.status(200).json( allOpenTabs );
        }
        return res.status(402).json({ message: 'Open tabs not found'})
    }
    catch(error: any){
        return res.status(500).json({error: error.message})
    }
})



router.post('/createNewTab', auth,  async(req, res) => {

    try {
        const userId = req.headers["userId"];

        // const parsedData = validateTabInput(req.body);
        console.log('create new route')
        // if (!parsedData.success){
        //     return res.status(411).json({error: parsedData.error})
        // }
        // const {noteId} = parsedData.data;
        const { noteId} = req.body;

        
        // first make isSelected property for all open tab = false
        const makeIsSelecetedFalse = await Notes.updateMany(
            {userId: userId},
            {$set: {isSelected: false}},
            {new: true}
        )
        if (makeIsSelecetedFalse.acknowledged){
            // now make isOpen = true & isSelected = true where _id = noteId
            const openAndSelectTab = await Notes.updateOne(
                {_id: noteId, userId: userId},
                {$set: {isOpen: true, isSelected: true}}
            );
            if (openAndSelectTab.acknowledged){
                const updateTabs = await Notes.find(
                    {userId: userId , isOpen: true},
                    {userId: 0, isOpen: 0, __v: 0}
                )
                return res.status(201).json({message: "Tab created successfully", tabs: updateTabs})
            }
            
        }
        return res.status(402).json({err: "error in creating new tab"});
    }
    catch(error: any) {
        console.log(error.message);
        return res.status(500).json({error: error.message})
    }

})


router.post('/remove-tab', auth, async (req, res) => {
    const userId = req.headers["userId"];
    const { tabId, nextTabId, content } = req.body;
    try {

        if (nextTabId && content){
            // menas that we are going to remove current working tab
            // 1. remove tab and  save content
            const removeTabAndSaveContent = await Notes.findByIdAndUpdate(
                {_id: tabId},
                {$set: {isOpen: false, isSelected: false, content: content}},
                {new: true}
            )
            
            if (removeTabAndSaveContent){
                // 2. select next tab
                const selectNewTab = await Notes.updateOne(
                    {_id: nextTabId},
                    {$set: {isSelected: true}},
                    {new: true}
                ) 
                if(selectNewTab.acknowledged){
                    const updatedTabs = await Notes.find(
                        {userId: userId, isOpen: true},
                        {userId: 0, isOpen: 0, __v: 0}     
                    )
                    return res.status(200).json({message: "Tab close successfully", updatedTabs})
                }        

                
            }
        }
        // otherwise we are going to delete the another tab which is not the current tab
        // so we dont't need to save the content and don't need to select new tab
        // only need to remove the tab 
        const removeTab = await Notes.updateOne(
            {_id: tabId},
            {$set: {isOpen: false}},
            {new: true}
        )
        if(removeTab.acknowledged){
            const updatedTabs = await Notes.find(
                {userId: userId, isOpen: true},
                {userId: 0, isOpen: 0, __v: 0}     
            )
            console.log('after last tab removed: ', updatedTabs)
            return res.status(200).json({message: "Tab close successfully", updatedTabs})
        }
        
       
        return res.status(402).json({message: "Could not close tab"});
    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }
})

// setCurrentTab
router.post('/select-next-tab',  auth, async(req, res) => {
    const userId = req.headers["userId"];
    try {
        const { tabId, previousTabId, content } = req.body;  
        // first make isSelected property for all open tab = false
        
        const makeIsSelecetedFalse = await Notes.updateMany(
            {userId: userId},
            {$set: {isSelected: false}},
            {new: true}
        )
        
        if (makeIsSelecetedFalse.acknowledged){
            const selectNextTab = await Notes.updateOne(
                {_id: tabId, userId: userId},
                {$set: {isSelected: true}},
                {new: true}
            )
            if (selectNextTab.acknowledged){

                // save the content where noteId == previousId
                if (previousTabId !== ""){
                    await Notes.findByIdAndUpdate(
                        {_id: previousTabId},
                        {$set: {content: content}},
                    );

                }
                const updatedTabArray = await Notes.find(
                    {userId: userId, isOpen: true},
                    {userId: 0, isOpen: 0, __v: 0}     
                )
                return res.status(201).json({ message: 'tab selected successfully', updatedTabArray}); 
            }

            
        }

        return res.status(402).json({message: 'could not select the tab'})
    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }
})


// router.post('/save-content', async(req, res) => {
//     try {
//         const{tabId, content} = req.body;
        
//         const tab = await Tabs.findById({_id: tabId}, {noteId: 1, _id: 0})

//         if (tab){
//             // first save the content in to Note collection
//             const saveInNoteCollection = await Note.findByIdAndUpdate({_id: tab.noteId}, {$set: {content: content}})        
//             if (saveInNoteCollection){
                
//                 // find by id and update
//                 const isContentSaved = await Tabs.findByIdAndUpdate(
//                     {_id: tabId}, 
//                     {$set: {content: content}
//                 })

//                 if(isContentSaved){
//                     return res.status(201).json("Content saved successfully")
//                 }
//                 else {
//                     return res.json('Failed to save the content')
//                 }
//             }

//         }

//     }
//     catch(error: any){
//         console.log(error.message)
//     }
// })
export default router;

