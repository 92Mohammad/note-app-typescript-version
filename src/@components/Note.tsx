import { MdEdit, MdDelete } from "react-icons/md";
interface NoteProps {
    id: string;
    title: string;
    isOpen: boolean;
    openNewTab: (id: string, title: string) => void;
    deleteNote: (noteId: string) => void

}

export const Note = ({id,  title, isOpen, openNewTab, deleteNote}: NoteProps) => {
  
    return (
        <div className="flex justify-between gap-3 bg-white text-black px-2 items-center">
            <span 
                className="text-[16px]  h-full w-full py-2 cursor-pointer"
                onClick = {() => !isOpen && openNewTab(id, title)}
            >
                {title}
            </span>
            <div className="flex gap-2 items-center h-full">
                <div className="px-1 rounded-sm py-1 bg-blue-400 cursor-pointer">
                    <MdEdit className=" "/>

                </div>
                <div  className="px-1 rounded-sm py-1 bg-blue-400 cursor-pointer"   >
                    <MdDelete  onClick={() => deleteNote(id)}/>

                </div>

              
            </div>


            
        </div>
    )
}