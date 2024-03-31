import express from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Note from "../models/note.model";



router.get('/getAllOpenTab',auth,  async(req, res) => {

    try {
        const userId = req.headers["userId"];

       const allOpenTabs = await Note.find(
           {userId: userId, openTab: true},
           {title: 1, selectedTab: 1, content: 1}
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



router.post('/postNewOpenTab', auth,  async(req, res) => {
    try {
        const noteId = req.body.note_id;
        const newTab = await Note.updateOne({_id: noteId}, {$set: {openTab: true}})
        if (newTab){
            return res.status(201).json({message: 'new open tab created'})
        }
        return res.status(402).json({message: "error in creating new tab"});
    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }

})


router.post('/closeOpenTab', auth, async (req, res) => {
    try {
        const noteId = req.body.note_id;
        const closeTab = await Note.updateOne({_id: noteId}, {$set: {openTab: false}})
        if (closeTab){
            return res.status(200).json({message: 'Tab closed successfully'})
        }
        return res.status(402).json({message: "Could not close tab"});
    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }
 })

// setCurrentTab
router.post('/select-tab', auth, async(req, res) => {
    try {
        const noteId = req. body.note_id;
        // first find by id and update the previous selected tab to false
        const makeSelectedTabFalse = await Note.updateMany({}, {$set: {selectedTab: false}});
        if (makeSelectedTabFalse){
            // now select the current tab to the note with id noteId
            const makeAsSelected = await Note.findByIdAndUpdate({_id: noteId}, {$set: {selectedTab: true}},  {new: true});
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

export default router;

