import { Note } from '../@components/Note';
import { TabsBar } from "../@components/TabsBar";
import { Editor } from "../@components/Editor";
import { useEffect, useState } from "react";
import { useNotes } from '../hooks/useNotes';
import { useSaveContent } from '../hooks/useSaveContent';
import { useTab } from '../hooks/useTab';


export interface NoteType {
  _id: string,
  title: string;
  isOpen?: boolean 
}

  
export interface TabsType  extends NoteType{
  selectedTab: boolean;
  content: string ;
  noteId: string
}


export const NotePage = () => {

  const { notes, setNotes, fetchAllNotes, createNewNote } = useNotes();  
  const[noteTitle, setNoteTitle] = useState<string>('');
  
  const [ selectedTab, setSelectedTab ] = useState<TabsType>({
    _id: "",
    title: "",
    selectedTab: false,
    content: "",
    noteId: ""
  });

  const [previousId, setPreviousId] = useState<string>("");
  
  const { saveContent } = useSaveContent(previousId);

  const { tabs, setTabs , getAllTabs, openNewTab, selectNextTab, removeTab}  = useTab({
    setSelectedTab,
    notes,
    setNotes,
    saveContent,
    previousId
  });
  
  useEffect(() => {
    fetchAllNotes()
  }, [])

        
  useEffect(() => {
    getAllTabs()

  }, [])


  
  const deleteNote = (id: string) => {
    // 1. delete the note from notes array
    const updatedNotes = notes.filter(note => note._id !== id)
    setNotes(updatedNotes);

    // 2. remove the open tab with the id
    removeTab(id);
  }

  

  return (
    <>
      <main className="max-h-screen text-white flex ">
        <section className="flex w-60  fixed top-0 bottom-0 flex-col bg-gray-800">
            <h1 className="text-3xl flex  justify-center ">My Notes</h1>
            <div className="flex justify-center flex-col">
              <div className="flex  justify-between ">
                <input 
                  type="text"
                  value=  {noteTitle}
                  className="px-2 py-1 mt-2 text-black w-[80%] outline-none focus:shadow-blue-500 shadow"
                  placeholder="Note..."
                  onChange={(e) => setNoteTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.code === 'Enter'){
                      createNewNote({noteTitle, setNoteTitle})
                    }
                  }}

                  />
                <button 
                  className="bg-blue-500 mt-2 w-12 font-semibold "
                  onClick={() => createNewNote({noteTitle, setNoteTitle})}
                  >
                    Add
                  </button>

              </div>
              <div className="flex flex-col gap-2 mt-2 ">
                {
                  notes.map((note, index) => {
                    return <Note 
                      id = {note._id}
                      key = {index}
                      title = {note.title}
                      isOpen = {note.isOpen!}
                      openNewTab = {openNewTab}
                      deleteNote={deleteNote}
                    /> 
                  })
                }
            </div>


          </div>
        </section >

        <section className = 'fixed top-0 bottom-0 left-60 right-0 flex flex-col bg-gray-900' >
          <TabsBar 
            tabs = {tabs}
            selectedTab={selectedTab}
            selectNextTab={selectNextTab}
            removeTab = {removeTab}
            previousId = {previousId}
          />
          <div className="text-white px-4 py-2 fixed top-10 bottom-0 left-60 right-0">
            <Editor 
              selectedTab = { selectedTab }
              setSelectedTab = {setSelectedTab}
              tabs={tabs}
              setTabs={setTabs}
              setPreviousId = {setPreviousId}
            /> 
          </div>
        </section>
      </main>
    </>
  )

}