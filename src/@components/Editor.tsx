import { setSelectedTab, setTabs } from '../features/TabSlice';
import { useAppDispatch, RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { setPreviousId } from '../features/NoteSlice';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";



export const Editor = () => {
    const dispatch = useAppDispatch();
    const { tabs , selectedTab} = useSelector((state: RootState) => state.tabs)

    const handleContent = (content: string)=> {
        dispatch(setPreviousId(selectedTab._id))
        // 1. first set the content of tabs 
        const updatedTabArray = tabs.map(tab => tab._id === selectedTab._id ? {...tab, content: content}: tab);
        dispatch(setTabs(updatedTabArray));

        // 2. set the selectedTab content property over here
        dispatch(setSelectedTab({...selectedTab, content: content}));

    }
    
    return (
        <div className = "h-full">
            <ReactQuill
                style = {{height: '695px'}}
                className="editor"        
                value={selectedTab &&  selectedTab.content }
                onChange={(value) => handleContent(value) }
                modules={{
                    toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                    ],
                }}
                formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "link",
                    "image",
                ]}
            />
          
        </div>
    )
}


// <textarea 
// value= { selectedTab &&  selectedTab.content }
// name="textarea" 
// id="textarea" 
// cols= {50}
// rows= {30} 
// className="w-full bg-gray-900 px-2 py-2 border-2 outline-none rounded-md"
// onChange = {(e) => handleContent(e.target.value) }
// >
// </textarea>