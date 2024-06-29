import { Note } from "../@components/Note";
import { TabsBar } from "../@components/TabsBar";
import { Editor } from "../@components/Editor";
import { useEffect } from "react";
import { getTabs, selectNextTab } from "../features/TabSlice";
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
  
  // const [selectedTab, setSelectedTab] = useState<TabsType>({
  //   _id: "",
  //   title: "",
  //   selectedTab: false,
  //   content: "",
  //   noteId: "",
  // });

  // const [previousId, setPreviousId] = useState<string>("");

  // const { saveContent } = useSaveContent(previousId);

  // const { tabs, setTabs, getAllTabs, selectNextTab, removeTab } =
  //   useTab({
  //     setSelectedTab,
  //     notes,
  //     setNotes,
  //     saveContent,
  //     previousId,
  //   });

  useEffect(() => {
    dispatch(getTabs())
  }, [dispatch, selectNextTab]);

  useEffect(() => {
    dispatch(fetchAllNotes());
  }, [dispatch, addNewNotes]);

  // const deleteNote = async (noteId: string) => {
  //   try {
  //     const res = await fetch("http://localhost:8000/note/delete-note", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: localStorage.getItem("authToken")!,
  //       },
  //       body: JSON.stringify({ noteId: noteId }),
  //     });
  //     if (res.ok) {
  //       // 1. first update the notes array locally
  //       const remainingNote = notes.filter((note) => note._id !== noteId);
  //       setNotes(remainingNote);

  //       // 2. get the next tab to select
  //       const removedTab = tabs.find((tab) => tab.noteId === noteId);

  //       if (removedTab) {
  //         const nextTab = getNextTab(tabs, removedTab._id);
  //         if (nextTab._id === "") {
  //           setSelectedTab(nextTab);
  //         } else {
  //           selectNextTab(nextTab, previousId);
  //         }
  //       }
  //       // 3. update the tabs array (remove the tab with noteId === above noteId)
  //       const remainingTabs = tabs.filter((tab) => tab.noteId !== noteId);
  //       setTabs(remainingTabs);
  //     }
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // };

  // const editNoteTitle = async (noteId: string, newTitle: string) => {
  //   // check if the title with noteId and newTitle are different then only make a backend call otherwise don't
  //   const note = notes.find((note) => note._id === noteId);
  //   if (note && note.title !== newTitle) {
  //     try {
  //       const res = await fetch(
  //         "http://localhost:8000/note/update-note-title",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             authorization: localStorage.getItem("authToken")!,
  //           },
  //           body: JSON.stringify({
  //             noteId: noteId,
  //             newTitle: newTitle,
  //           }),
  //         }
  //       );

  //       if (res.ok) {
  //         // 1. update the title from note array
  //         const updatedNoteArray = notes.map((note) =>
  //           note._id === noteId ? { ...note, title: newTitle } : note
  //         );
  //         setNotes(updatedNoteArray);

  //         // 2. update the title from tab array
  //         const updatedTabsArray = tabs.map((tab) =>
  //           tab.noteId === noteId ? { ...tab, title: newTitle } : tab
  //         );
  //         setTabs(updatedTabsArray);
  //       }
  //     } catch (error: any) {
  //       console.log(error.message);
  //     }
  //   }
  // };

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
