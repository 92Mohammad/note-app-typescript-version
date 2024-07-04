import { MdEdit, MdDelete } from "react-icons/md";
import { useState } from "react";
import { updateTitle, setIsDelete } from "../features/NoteSlice";
import { openTab } from "../features/TabSlice";
import { useAppDispatch } from "../app/store";


interface NoteProps {
    id: string;
    title: string;
    isOpen: boolean;
}

export const Note = ({id,  title, isOpen}: NoteProps) => {
    
    const dispatch = useAppDispatch();
    const [newTitle, setNewTitle] = useState<string>(title);

    const [edit, setEdit] = useState<boolean>(false);
    
    const handleUpdateTitle = () => {
        setEdit(prevEdit => !prevEdit)
        dispatch(updateTitle({noteId: id, newTitle}))
    }

    return (
        <div className="flex justify-between gap-3 bg-[#38444D] text-white px-2 items-center hover:bg-gray-500">
            {
                !edit ? (
                    <span 
                        className="text-[16px]  h-full w-full py-2 cursor-pointer"
                        onClick = {() => !isOpen && dispatch(openTab(id))}
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
                            <MdDelete  onClick={() => dispatch(setIsDelete({id, isDelete: true, isOpen: isOpen}))}/>
        
                        </div>              
                    </div>
                )
            }            
        </div>
    )
}