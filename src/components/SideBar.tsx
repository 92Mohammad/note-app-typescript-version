import { BiSolidUserCircle, BiChevronDown } from "react-icons/bi";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import Notes from "./Notes";
import "../css/sidebar.css";
import {
    SideBarProps,
    RequestParameter,
    Note,
    InputBoxProps,
    ButtonProps
} from "../utils";

import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";


export default function SideBar({getAllOpenTab}: SideBarProps) {
  const navigate = useNavigate();

  const [click, setClick] = useState({
    openInput: false,
    closeInput: true,
  });

  const [notes, setNotes] = useState<Note[]>([]);

  const [logout, setLogout] = useState<boolean>(false);
  console.log('note state: ', notes)
  function openInputBox() {
    setClick((prevClick) => {
      return {
        ...prevClick,
        closeInput: !prevClick.closeInput,
        openInput: !prevClick.openInput,
      };
    });
  }

  const createNotes = async (Title: string) => {
    try {
      console.log("hello there")
      const createNoteParameter: RequestParameter = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwtToken")!,
        },
        body: JSON.stringify({ title: Title }),
      }

      const response = await fetch("http://localhost:8000/note/createNotes", createNoteParameter);

      if (response.status === 201) {
        console.log("success")
        setClick((prevClick) => {
          return {
            ...prevClick,
            closeInput: !prevClick.closeInput,
            openInput: !prevClick.openInput,
          };
        });
        // when a new note added successfully then call the getAllNotes method to fetch the all notes along with the new notes
        const data = await response.json();
        const newNote: Note = {
          _id: data.note_id,
          title: Title
        }
        console.log("before set Note ")
        setNotes((prevNote) => [...prevNote, newNote])
        console.log('after setNote')
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  
  const getAllNotes = async () => {
    try {
      const getNotesParameter: RequestParameter = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwtToken")!,
        },
      }
        const res = await fetch("http://localhost:8000/note/getAllNotes", getNotesParameter);

        if (res.status === 200) {
            const data = await res.json();
            console.log('get all notes :  ', data)
            setNotes(data.notes);
        }
    } catch (error: any) {
        console.log(error.message);
    }
};

  useEffect(() => {
    getAllNotes();
    // setNotes()

  }, []);

 

  function openDropdown() {
    setLogout((prevLogout) => !prevLogout);
  }

  const logOut = async () => {
    try {
      const logOutParameter: RequestParameter = {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("jwtToken")!,
        },
      }
      const response = await fetch("http://localhost:8000/user/logout", logOutParameter);
      if (response.status === 200) {
        localStorage.removeItem("jwtToken");
        navigate('/')
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="side-bar">
        <div className="logo">
          <span className="logo-title">My Notes</span>
          <div className="user">
            <BiChevronDown className="down-arrow" onClick={() => openDropdown() } />
            <BiSolidUserCircle className="user-icon" />
          </div>

          {logout && (
            <div className="drop-down-menu">
              <div className="my-user">
                <FaUserAlt className="current-user" />
                <span className="user-name">Emad</span>
              </div>
              <div className="logout-section">
                <RiLogoutCircleRFill className="logout-icon" />
                <span className="logout-btn" onClick={logOut}>
                  Log Out
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="create-btn-container">
          {click.openInput && <InputBox createNotes={createNotes} />}
          {click.closeInput && <CreateNoteButton openInputBox={openInputBox} />}
        </div>
        {notes.length !== 0 && notes.map((note, index) => (
          <Notes
            key={index}
            noteId={note._id}
            title={note.title}
            getAllOpenTab = {getAllOpenTab}
            setNotes={ setNotes }
            notes = {notes}
            // openNewNoteEditor = {props.openEditor}
            // define the function of opening a new editor associated with the current Note in side baar
          />
        ))}
      </div>
    </>
  );
}

function InputBox({ createNotes }: InputBoxProps) {
  const [noteTitle, setNoteTitle] = useState<string>("");

  return (
    <>
      <div className="input-title">
        <input
            placeholder="Note..."
            type="text"
            onChange= {(e) => setNoteTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter"){
                console.log("inside key down")
                createNotes(noteTitle)
              }
            }}
        />
        <button onClick={() => createNotes(noteTitle)}>
          + Create
        </button>
      </div>
    </>
  );
}

function CreateNoteButton({openInputBox}: ButtonProps) {
  return (
    <>
      <button className="create-note-btn" onClick={ () => openInputBox() }>
        + Create New Note
      </button>
    </>
  );
}
