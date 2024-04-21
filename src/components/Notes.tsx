import { MdEdit, MdDelete } from "react-icons/md";
import "../css/sidebar.css";
import { useState } from 'react'
import AlertDialogSlide from '../components/AlertDialogSlide'
import { NotesProps, RequestParameter } from '../utils'

export default function Notes({noteId, title, isOpen, getAllOpenTab, notes,  setNotes, tabs, setTabs}: NotesProps) {
  
  const[edit, setEdit] = useState<boolean>(false);
  const[updatedTitle, setUpdatedTitle] = useState<string>("");
  const [isOpenAlertBox, setIsOpenAlertBox] = useState<boolean>(false);
  console.log('all notes are : ' , notes)
 
 
  const postNewOpenTab = async(noteId: string) => {
    console.log('post new open tab')
    
    try {
      const response = await fetch('http://localhost:8000/tab/postNewOpenTab' ,{
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
          authorization: localStorage.getItem("jwtToken")!
        },
        body: JSON.stringify({
          note_id: noteId})
        })

      if (response.status === 201){
        // when you are opening new tab make the openTab property as true in notes state

        const updatedNotes = notes.map(note => note._id === noteId ? {...note, openTab: true}: note);

        setNotes(updatedNotes);

        /*
          1. make selectedTab property of previous tabs false and new Tab as true.
          2. add new tab.
        */

        const updatedTab = tabs.map(tab => {
          return {...tab, selectedTab: false}
        })
        updatedTab.push({_id: noteId, title: title, selectedTab: true});
        setTabs(updatedTab);
      }  
    }
    catch(error){
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
        setNotes(notes.map((note) => note._id === noteId ? {...note, _id: noteId, title: updatedTitle} : note))
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
          onClick={() => !isOpen && postNewOpenTab(noteId)}
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
              onClick={() => setIsOpenAlertBox((prevState) => !prevState)}
          />
        </div>
        {
          isOpenAlertBox && <AlertDialogSlide noteId={noteId} title = {title} notes = {notes} setNotes = {setNotes} setIsOpenAlertBox = {setIsOpenAlertBox} tabs = {tabs} setTabs = {setTabs}/>
        }

      </div>
    </>
  );
}
