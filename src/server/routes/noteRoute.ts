import express from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Note from '../models/note.model'

interface NoteType {
    note_id: string,
    note_content: string
}
router.get('/getAllNotes', auth, async(req, res) => {
    console.log('get all note route')
    try {
        const userId = req.headers["userId"]
        
        const notes = await Note.find(
            { userId: userId},
            {content: 0, selectedTab: 0}

        ) as NoteType[];
        console.log('notes: ',notes)
        if (notes.length !== 0){

            return res.status(200).json({notes})
        }
        return res.status(402).json({ message: 'You have no Notes'})

    }
    catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ error: error.message})
    }
})


router.post('/createNotes', auth, async(req, res) => {
    try{
        const noteTitle = req.body.title;
        const userId = req.headers["userId"];
        const newNote = await Note.create({title: noteTitle, userId: userId});

        if (newNote){
            return res.status(201).json({message: 'Notes created successfully', note_id: newNote._id})
        }
        return res.status(402).json({ message: 'Not able to create'});
    }
    catch(error: any){
        return res.status(500).json({ error: error.message})
    }

})



router.post('/deleteNote', auth, async (req, res) => {
    try {
        const { noteId } = req.body;
        const deleteResult = await Note.deleteOne({ _id: noteId})
        if (!deleteResult) {
            return res.status(500).json({ message: "Could not delete note"});
        }
        console.log('deleted result: ', deleteResult);
        return res.status(201).send({ message: "notes deleted successfully" })
    }
    catch (error: any) {
        return res.status(500).json({ error: error.messgae});
    }

})




export default router;
