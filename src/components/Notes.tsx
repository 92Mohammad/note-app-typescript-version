import { MdEdit, MdDelete } from "react-icons/md";
import "../css/sidebar.css";
import { useState } from 'react'
import { NotesProps, RequestParameter } from '../utils'

export default function Notes({noteId, title, getAllOpenTab, notes,  setNotes}: NotesProps) {
  const [isOpen , setIsOpen] = useState(true)
  const[edit, setEdit] = useState<boolean>(false);
  const[updatedTitle, setUpdatedTitle] = useState<string>("")

  const postNewOpenTab = async(noteId: string) => {
    try {
      const response = await fetch('http://localhost:8000/tab/postNewOpenTab' ,{
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          note_id: noteId})
        })

      if (response.status === 200){
          await getAllOpenTab();
        // how can I call the seAscurrentTab function over here
      } 
    }
    catch(error){
      console.log(error);
    }
  }

  const deleteNote = async () => {
    try {
      const deleteNoteParameter: RequestParameter = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwtToken")!
        },
        body: JSON.stringify({
          noteId: noteId,
          title: title,
        })
      }
      const response = await fetch("http://localhost:8000/note/deleteNote", deleteNoteParameter);

      if (response.status === 201) {
        // here change the notes state so that react re-render the Note component
        setNotes(notes.filter((note) => note._id !== noteId));
      }
    } catch (error) {
      console.log(error); 
    }
  }

  const updateNoteTitle = async() => {
    try {
      const updateNoteTitleParameter: RequestParameter = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwtToken")!
        },
        body: JSON.stringify({
          noteId: noteId,
          title: updatedTitle,
        })
      }
      const response = await fetch("http://localhost:8000/note/update-note-title", updateNoteTitleParameter);
      if (response.status === 201){
        setNotes(notes.map((note) => note._id === noteId ? {_id: noteId, title: updatedTitle} : note))
      }
    }
    catch(error: any){
      console.log(error.message)
    }

  }
  return (
    <>
      <div className="note-container">
        <div
          className="left-part"
          onClick={() => isOpen && postNewOpenTab(noteId)}
        >
          {
            edit ? (
                <input
                    className = "edit-title"
                    type = 'text'
                    placeholder={"Edit title..."}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    onKeyDown={() => updateNoteTitle()}
                />
            ) : (
                <p className="note-title">{title}</p>
            )
          }
        </div>
        <div className='right-note-part'>
        <MdEdit
              className = 'edit-btn'
              onClick = {() => setEdit((prevEdit) => !prevEdit)}
          />
          <MdDelete
              className="delete-btn"
              onClick={() => deleteNote() }
          />
        </div>

      </div>
    </>
  );
}