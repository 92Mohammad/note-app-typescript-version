import express from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Note from '../models/note.model'

router.post('/saveContent', auth, async (req, res) => {
    try {
        const {noteContent, noteId} = req.body;

        const saveContent = await Note.findByIdAndUpdate(
            {_id: noteId },
            {$set: {content: noteContent}},
            {new: true}
        );

        if (saveContent){
            return res.status(201).json({message: "Content saved successfully"});
        }
        return res.status(204).json({ message: 'could not save the content'});
    }
    catch(error: any){
        return res.status(500).json({error: error.message})
    }

})


router.get('/getContent', auth, async (req, res) => {
    // return the note_content of currentTab(or where currentTab == true)
    try {
        const noteId = req.headers["userId"];
        console.log(noteId);
        const content = await Note.findOne(
            {userId: noteId, selectedTab: true},
            {content: 1}
        )

        if (content){
            // return res.status(200).json(content.content);
        }
    
        return res.status(204).json({ message: 'could not get the content'});
    }
    catch(error: any){
        return res.status(500).json({error: error.message})
    }
})

export default router;