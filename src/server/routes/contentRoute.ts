import express from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Note from '../models/note.model'

router.post('/saveContent', auth, async (req, res) => {
    try {
        const {noteContent, noteId} = req.body;
        console.log(noteId, noteContent)
        const saveContent = await Note.findByIdAndUpdate(
            {_id: noteId },
            {$set: {content: noteContent}},
            {new: true}
        );
        if (saveContent){
            console.log('inside save content')
            return res.status(201).json({message: "Content saved successfully"});
        }
        return res.status(204).json({ message: 'could not save the content'});
    }
    catch(error: any){
        return res.status(500).json({error: error.message})
    }

    // //note_content
    // const sql = 'UPDATE notes SET note_content = ?  WHERE note_id = ?'
    // connection.query(sql, [noteContent, noteId] , (error, results) => {
    //     if (error){
    //         console.log(error.message);
    //         return res.status(500).json({message: "Query failed"})
    //     }
    //     else {
    //         return res.status(200).send({message: "Content saved successfully"})
    //     }
    // })
})


router.get('/getContent', auth, async (req, res) => {
    // return the note_content of currentTab(or where currentTab == true)
    try {
        const noteId = req.headers["userId"];

        const content = await Note.findOne({_id: noteId, selectedTab : true});
        console.log('content = ', content)
        if (content){
            console.log('inside get content ', content)
            return res.status(200).json(content);
        }
        console.log('outside content')
        return res.status(204).json({ message: 'could not get the content'});

        // const sql = 'SELECT note_content FROM notes WHERE currentTab = ?'
        // connection.query(sql, [true], (error, results) => {
        //     if (error) {
        //         console.log(error.message)
        //         return res.status(500).json({ message: "Query failed" })
        //     }
        //     else {
        //         return res.status(200).send(results[0])
        //     }
        // })
    }
    catch(error: any){
        return res.status(500).json({error: error.message})
    }
})

export default router;