import express,  {Request, Response } from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Note from '../models/note.model'
import Tabs from '../models/tab.model';

interface NoteType {
    note_id: string,
    note_content: string
}
router.get('/getAllNotes', auth, async(req: Request, res: Response) => {
    
    try {
        const userId = req.headers["userId"]
        
        const notes = await Note.find(
            { userId: userId}
        ) as NoteType[];
        
        if (notes.length !== 0){

            return res.status(200).json({messageType: 'success', notes} )
        }
        return res.status(402).json({messageType: 'error', error: 'You have no Notes'})

    }
    catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ messageType: 'error', error: error.message})
    }
})


router.post('/createNotes', auth, async(req: Request, res: Response) => {
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


router.post('/update-note-title', auth,  async(req: Request, res: Response) => {
    try {
        const { noteId, newTitle} = req.body;
        console.log(noteId, " ", newTitle);

        const updatedNote = await Note.findByIdAndUpdate(
            {_id: noteId},
            {$set: {title: newTitle}},
        )
        if(updatedNote){
            // now update the title from Tab collection
            const updatedTab = await Tabs.updateOne(
                {noteId: noteId},
                {$set: {title: newTitle}},
                {new: true}
            )
            if (updatedTab){
                return res.status(200).json({message: "Title updated succesfully in both collection"});
            }
            return res.status(501).json({message: "Could not  updated title in Tab collection successfully"})
        }
        return res.status(501).json({message: "Could not updated title in Note collection successfully"});
    }
    catch(error: any){
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }

})

router.delete('/delete-note', auth, async (req: Request, res: Response) => {
    try {
        const { noteId } = req.body;
        // first delete the note from Note collection
        
        const deleteResult = await Note.deleteOne({ _id: noteId});
        console.log('deleted result is: ', deleteResult);


        if (!deleteResult) {
            return res.status(500).json({ message: "Could not delete note from Note collection"});
        }
        // also remove the note from Tabs collection
        const removedTab = await Tabs.deleteOne({noteId: noteId});
        if (!removedTab){
            return res.status(500).json({ message: "Could not delete note from Tabs collection"});

        }
        return res.status(200).json({message: "Note deleted successfully from both collection"})
        
    }
    catch (error: any) {
        return res.status(500).json({ error: error.messgae});
    }

})

export default router;
