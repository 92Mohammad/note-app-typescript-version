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
           {userId: 0, isOpen: 0}
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

        const parsedData = validateTabInput(req.body);
        if (!parsedData.success){
            return res.status(411).json({error: parsedData.error})
        }
        const {noteId} = parsedData.data;
        
        const isTabOpen = await Notes.updateMany(
            {}, 
            { 
                $cond: {
                    if: {
                        $eq: {_id: noteId}
                    },
                    then: {
                        $set: {isSelected: true, isOpen: true}
                    },
                    else: {
                        $set: {isSelected: false}
                    }
                }

            },
            {multi: true},
        )
        console.log('is tab open: ', isTabOpen);
        if (isTabOpen){
            const updateTabs = await Notes.find(
                {userId: userId , isOpen: true},
                {userId: 0, isOpen: 0}
            )
            return res.status(201).json({message: "Tab created successfully", tabs: updateTabs})
        }
        return res.status(402).json({err: "error in creating new tab"});
    }
    catch(error: any) {
        console.log(error.message);
        return res.status(500).json({error: error.message})
    }

})


router.post('/remove-tab', auth, async (req, res) => {
    try {
        const { noteId, previousId, content } = req.body;
        const removeTab = await Notes.findByIdAndUpdate(
            {_id: noteId},
            {$set: {isOpen: false, isSelected: false, content: content}}
        )
        if (removeTab){
            if (noteId !== previousId && previousId !== ""){
                await Notes.findByIdAndUpdate({_id: previousId}, {$set: {isSelected: true}})
            }   
            return res.status(200).json({message: "Tab close successfully"})
        }
              
        return res.status(402).json({message: "Could not close tab"});
    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }
})

// setCurrentTab
router.post('/select-next-tab',  async(req, res) => {
    try {
        const { tabId, previousTabId, content } = req.body;
        
        // first make seletecTab property of all tab false
        const updateSelectionProperty = await Notes.updateMany(
            {},
            {
                $cond: {
                    if: {
                        $eq: {_id: tabId},
                    },
                    then: {
                        $set:  {selectedTab: true}
                    },
                    else: {
                        $set:  {selectedTab: false}
                    }

                }
            }
        )
        if ( updateSelectionProperty ){
            // save the content where noteId == previousId
            if (previousTabId !== ""){
                await Notes.findByIdAndUpdate(
                    {_id: previousTabId},
                    {$set: {content: content}},
                );

            }
            return res.status(201).json({ message: 'tab selected successfully'}); 
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

