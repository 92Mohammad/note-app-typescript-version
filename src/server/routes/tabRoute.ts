import express from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Tabs from "../models/tab.model";
import Note from '../models/note.model';
import { validateTabInput } from '../inputValidation';



router.get('/get-all-tabs',auth,  async(req, res) => {

    try {
        const userId = req.headers["userId"];

       const allOpenTabs = await Tabs.find(
           {userId: userId},
           {userId: 0}
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
        const {noteId, title} = parsedData.data;
        
        const isTabOpen = await Note.findByIdAndUpdate(
            {_id: noteId}, 
            {$set: {isOpen: true}},
            {new: true}

        )

        if (isTabOpen){
            const makeAllSelectedTabFalse = await Tabs.updateMany(
                {},
                {$set: {selectedTab: false}}
            )
            if(makeAllSelectedTabFalse){

                // create a new tab
                const newTab = await Tabs.create(
                    {
                        title: title,
                        selectedTab: true,
                        content: isTabOpen.content,
                        noteId: noteId,
                        userId: userId
                    }
                )
                if (newTab){
                    const tab = {
                        _id: newTab._id,
                        title: newTab.title,
                        selectedTab: newTab.selectedTab,
                        content: newTab.content,
                        noteId: newTab.noteId
                    }
                    return res.status(201).json({message: 'New tab created', tab})
                }
                else {
                    return res.status(402).json({message: 'tab selection failed!!'})

                }
            }
        }
        return res.status(402).json({message: "error in creating new tab"});
    }
    catch(error: any) {
        console.log(error.message);
        return res.status(500).json({error: error.message})
    }

})


router.post('/remove-tab', auth, async (req, res) => {
    try {
        const { tabId } = req.body
        console.log('remove tab route hit')

        // first save the conttent of tabId into noteId
        const tab = await Tabs.findOne({_id: tabId}, {content: 1, noteId: 1,  _id: 0})

        if (tab){
            // save the tab content into Note collection
            const note = await Note.findByIdAndUpdate({_id: tab.noteId}, {$set: {content: tab.content, isOpen: false}})
            if (note){
                const closeTab = await Tabs.deleteOne({_id: tabId} )
                if (closeTab){
                    return res.status(200).json({message: 'Tab closed successfully'})
                }

            }
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
        const { tabId, previousTabId } = req.body;


        // first make seletecTab property of all tab false
        const makeSelectedTabFalse = await Tabs.updateMany({}, {$set: {selectedTab: false}});
        if (makeSelectedTabFalse){
            // now select the current tab with tab id = tabId
            const makeAsSelected = await Tabs.findByIdAndUpdate({_id: tabId}, {$set: {selectedTab: true}},  {new: true});
            if (makeAsSelected){
                return res.status(201).json({ message: 'tab selected successfully'});
            }
            return res.status(402).json({message: 'could not select the tab'})
        }
    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }
})


router.post('/save-content', async(req, res) => {
    try {
        const{tabId, content} = req.body;
        
        const tab = await Tabs.findById({_id: tabId}, {noteId: 1, _id: 0})

        if (tab){
            // first save the content in to Note collection
            const saveInNoteCollection = await Note.findByIdAndUpdate({_id: tab.noteId}, {$set: {content: content}})        
            if (saveInNoteCollection){
                
                // find by id and update
                const isContentSaved = await Tabs.findByIdAndUpdate(
                    {_id: tabId}, 
                    {$set: {content: content}
                })

                if(isContentSaved){
                    return res.status(201).json("Content saved successfully")
                }
                else {
                    return res.json('Failed to save the content')
                }
            }

        }

    }
    catch(error: any){
        console.log(error.message)
    }
})
export default router;

