import { MdEdit, MdDelete } from "react-icons/md";
import { useState } from "react";


interface NoteProps {
    id: string;
    title: string;
    isOpen: boolean;
    openNewTab: (id: string, title: string) => void;
    deleteNote: (noteId: string) => void,
    onUpdate: (noteId: string, newTitle: string ) => Promise<void>

}

export const Note = ({id,  title, isOpen, openNewTab, deleteNote,   onUpdate}: NoteProps) => {
    
    const [newTitle, setNewTitle] = useState<string>(title);

    const [edit, setEdit] = useState<boolean>(false);
    

  
    const handleUpdateTitle = () => {
        setEdit(prevEdit => !prevEdit)
        onUpdate(id, newTitle)
    }

    return (
        <div className="flex justify-between gap-3 bg-[#38444D] text-white px-2 items-center ">
            {
                !edit ? (
                    <span 
                        className="text-[16px]  h-full w-full py-2 cursor-pointer"
                        onClick = {() => !isOpen && openNewTab(id, title)}
                    >
                        {title}
                    </span>

                ) : (
                    <input 
                        value = {newTitle}
                        type = "text"
                        placeholder="Title"
                        className = 'outline-none h-[90%] bg-[#15202B] py-2 w-full rounded-md px-1'
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.code === "Enter"){
                                handleUpdateTitle ();
                            }
                        }}
                    />
                )
            }
            {
                edit ? (
                    <button 
                        className="bg-[#15202B] px-3 h-[85%] rounded-md"
                        onClick = {() => handleUpdateTitle () }
                    >
                        Save
                    </button>
                ) : (
                    <div className="flex gap-2 items-center h-full">
                        <div className="px-1 rounded-sm py-1 bg-[#15202B] cursor-pointer">
                            <MdEdit
                                className=""
                                onClick = {() => setEdit(prevEdit => !prevEdit)}
                            /> 
        
                        </div>
                        <div  className="px-1 rounded-sm py-1 bg-[#15202B] cursor-pointer"   >
                            <MdDelete  onClick={() => deleteNote(id)}/>
        
                        </div>              
                    </div>
    

                )

            }
            
           

            
        </div>
    )
}