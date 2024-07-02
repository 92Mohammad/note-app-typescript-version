import { Note } from "../@components/Note";
import { TabsBar } from "../@components/TabsBar";
import { Editor } from "../@components/Editor";
import { useEffect } from "react";
import { getTabs, selectNextTab, setTabs} from "../features/TabSlice";
import {
  fetchAllNotes,
  createNewNote,
  setNoteTitle,
  addNewNotes,  
} from "../features/NoteSlice";
import { useSelector } from "react-redux";
import {  RootState, useAppDispatch } from "../app/store";



export const NotePage = () => {
  const dispatch = useAppDispatch();
  const { notes, noteTitle } = useSelector((state: RootState) => state.notes);
  

  useEffect(() => {
    dispatch(getTabs())
  }, []);

  useEffect(() => {
    dispatch(fetchAllNotes());
  }, [dispatch, addNewNotes]);

  
  return (
    <>
      <main className="max-h-screen text-white flex ">
        <section className="flex w-60  fixed top-0 bottom-0 flex-col bg-gray-800">
          <h1 className="text-3xl flex  justify-center ">My Notes</h1>
          <div className="flex justify-center flex-col">
            <div className="flex  justify-between  ">
              <input
                type="text"
                value={noteTitle}
                className="px-2 py-1 mt-2 text-black w-[75%] outline-none     rounded-sm"
                placeholder="Note..."
                onChange={(e) => dispatch(setNoteTitle(e.target.value))}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    dispatch(
                      createNewNote({ noteTitle, setNoteTitle, addNewNotes })
                    );
                  }
                }}
              />
              <button
                className="bg-[#15202B] mt-2 w-14 font-semibold border border-white rounded-md  shadow-lg shadow-cyan-500/50 "
                onClick={() =>
                  dispatch(
                    createNewNote({ noteTitle, setNoteTitle, addNewNotes })
                  )
                }
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-2 mt-2 ">
              {notes.map((note, index) => {
                return (
                  <Note
                    id={note._id}
                    key={index}
                    title={note.title}
                    isOpen={note.isOpen!}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="fixed top-0 bottom-0 left-60 right-0 flex flex-col bg-gray-900">
          <TabsBar />
          <div className="text-white px-4 py-2 fixed top-10 bottom-0 left-60 right-0">
            <Editor/>
          </div>
        </section>
      </main>
    </>
  );
};
