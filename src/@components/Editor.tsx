import { setTabs } from '../features/TabSlice';
import { useAppDispatch, RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";



export const Editor = () => {
    const dispatch = useAppDispatch();
    const { tabs } = useSelector((state: RootState) => state.tabs)
    const currentTab = tabs.find(tab => tab.isSelected);
    const [content, setContent ] = useState<string>(currentTab ? currentTab.content: "");

    useEffect(() => {
        if (currentTab){
            setContent(currentTab.content)
        }
        else {
            setContent("")
        }
    }, [currentTab])

    
    useEffect(() => {
        if (currentTab){
            const updateTabArray = tabs.map(tab => tab.isSelected ? {...tab, content: content} : tab)
            dispatch(setTabs(updateTabArray))
        }
    }, [content])

    
    return (
        <div className = "h-full">
            <ReactQuill
                style = {{height: '695px'}}
                className="editor"        
                value={content }
                onChange={(value) => setContent(value) }
                modules={{
                    toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
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