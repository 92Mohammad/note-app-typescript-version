import express,  {Request, Response } from 'express'
const router = express.Router();
import auth from '../middleware/jwtAuthenticate'
import Notes from '../models/note.model'



router.get('/getAllNotes', auth, async(req: Request, res: Response) => {
    
    try {
        const userId = req.headers["userId"]
        
        const notes = await Notes.find(
            { userId: userId},
            {_id: 1, title: 1, isOpen: 1, userId: 0}
        ) 
        console.log('all notes: ', notes);
        
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
        const newNote = await Notes.create({title: noteTitle, userId: userId});
        if (newNote){
            return res.status(201).json({message: 'Notes created successfully', noteId: newNote._id})
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

        const updatedNote = await Notes.findByIdAndUpdate(
            {_id: noteId},
            {$set: {title: newTitle}},
        )
        if(updatedNote){            
            return res.status(200).json({message: "Title updated succesfully in both collection"});
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
        const { noteId, previousId } = req.body;
        // first delete the note from Note collection
        
        const deleteResult = await Notes.findByIdAndDelete({ _id: noteId});
        console.log('deleted result is: ', deleteResult);


        if (!deleteResult) {
            return res.status(500).json({ message: "Could not delete note from Note collection"});
        }
        if (previousId !== noteId){
            await Notes.findByIdAndUpdate(
                {_id: previousId},
                {$set: {isSelected: true}}
            )
        }
        return res.status(200).json({message: "Note deleted successfully from both collection"})        
    }
    catch (error: any) {
        return res.status(500).json({ error: error.messgae});
    }

})

export default router;
