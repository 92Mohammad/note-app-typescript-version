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
        console.log('create new tab route hit')

        
        // first make isSelected property for all open tab = false
        const makeIsSelecetedFalse = await Notes.updateMany(
            {userId: userId},
            {$set: {isSelected: false}},
            {new: true}
        )
        console.log('mark false: ', makeIsSelecetedFalse);
        if (makeIsSelecetedFalse.acknowledged){
            // now make isOpen = true & isSelected = true where _id = noteId
            const openAndSelectTab = await Notes.updateOne(
                {_id: noteId, userId: userId},
                {$set: {isOpen: true, isSelected: true}}
            );

            console.log('tab open and selected: ', openAndSelectTab);
            if (openAndSelectTab.acknowledged){
                const updateTabs = await Notes.find(
                    {userId: userId , isOpen: true},
                    {userId: 0, isOpen: 0, __v: 0}
                )
                console.log('updated tab is: ', updateTabs);
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

    try {
        const { noteId, previousTabId, content } = req.body;
        const removeTab = await Notes.findByIdAndUpdate(
            {_id: noteId},
            {$set: {isOpen: false, isSelected: false, content: content}}
        )
        if (removeTab){
            if (noteId !== previousTabId && previousTabId !== ""){
                await Notes.findByIdAndUpdate({_id: previousTabId}, {$set: {isSelected: true}})
            }   
            const updatedTabs = await Notes.find(
                {userId: userId, isOpen: true},
                {userId: 0, isOpen: 0, __v: 0}     
            )
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
        console.log('content : ', content);

        
        // first make seletecTab property of all tab false
          
        // first make isSelected property for all open tab = false
        
        const makeIsSelecetedFalse = await Notes.updateMany(
            {userId: userId},
            {$set: {isSelected: false}},
            {new: true}
        )
        console.log('make false false: ', makeIsSelecetedFalse)
        if (makeIsSelecetedFalse.acknowledged){
            const selectNextTab = await Notes.updateOne(
                {_id: tabId, userId: userId},
                {$set: {isSelected: true}},
                {new: true}
            )
            console.log('after selecting next tab :', selectNextTab)
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

