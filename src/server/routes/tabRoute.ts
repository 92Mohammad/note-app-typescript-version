import express from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Note from "../models/note.model";



router.get('/getAllOpenTab',auth,  async(req, res) => {

    try {
        const userId = req.headers["userId"];
        const notes = await Note.find({_id: userId});
        const allOpenTabs = notes.map((note) => ({ _id: note._id, title: note.title, selectedTab: note.selectedTab }));
        if (allOpenTabs){
            return res.status(200).json({ allOpenTabs });
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

    // now set the isTabOpen column as true in notes table so that we can identify that which tab is opened
    // const sql = 'UPDATE notes SET isOpenTab = ?  WHERE note_id = ?'
    // connection.query(sql, [true, noteId], (error, results) => {
    //     if (error){
    //         console.log(error.message);
    //         return res.status(500).json({message: "Query failed"})
    //     }
    //     else {
    //         return res.status(200).send({message: "Tab opened successfully"})
    //     }
    // })
})


router.post('/closeOpenTab', auth, async (req, res) => {
    try {
        const noteId = req.body.note_id;
        const closeTab = await Note.updateOne({_id: noteId}, {$set: {openTab: false}})
        if (closeTab){
            return res.status(201).json({message: 'Tab closed successfully'})
        }
        return res.status(402).json({message: "Could not close tab"});
    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }

    // const sql = 'UPDATE notes SET isOpenTab = ? WHERE note_id = ?'
    // connection.query(sql, [false, noteId], (error, results) => {
    //     if (error){
    //         console.log(error.message);
    //         return res.status(500).json({message: "Query failed"})
    //     }
    //     else {
    //         return res.status(200).send({message: "tab closed successfully"})
    //
    //     }
    // })
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
    catch(error: any){
        return res.status(500).json({error: error.message})
    }

    // make the value of currentTab as true for the given noteId and make rest fo the currentTab column as false
    // const sql1 = 'UPDATE notes SET currentTab = ?'
    // connection.query(sql1, [false], (error) => {
    //     if (error){
    //         console.log(error.message);
    //         return res.status(500).json({message: "Query failed"})
    //     }
    //     else {
    //         // if query does not fail it means that all value in currentTab column has been set to flase or 0
    //         // now make a new query to set the value of currentTab which have note_id = noteId as true or 1
    //         const sql2 = 'UPDATE notes SET currentTab = ? WHERE note_id = ?'
    //         connection.query(sql2, [true, noteId], (error) => {
    //             if (error){
    //                 console.log(error.message);
    //                 return res.status(500).json({message: "Query failed"})
    //             }
    //             else {
    //                 return res.status(200).send({message: "Current tab has been set successfully"})
    //             }
    //         })
    //     }
    // })
})

export default router;

