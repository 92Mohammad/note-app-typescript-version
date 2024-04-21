import '../css/window.css'
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import {RequestParameter, WindowProps} from "../utils";
import { Reorder} from "framer-motion";

export default function Window({_id, title, selectedTab, setContent, tab,  tabs, setTabs, currentSelectedTab, setCurrentSelectedTab, setTabSwitch, notes, setNotes}: WindowProps ){
    const[buttonVisible, setButtonVisible] = useState<boolean>(false);

    const closeOpenTab = async (noteId: string) => {
        try {
            const closeTabParameter: RequestParameter  = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("jwtToken")!
                },
                body: JSON.stringify({
                    note_id: noteId
                })
            }
            const response = await fetch('http://localhost:8000/tab/closeOpenTab', closeTabParameter)

            if (response.status === 200){
                // set note openTab property as false over here
                setNotes(notes.map(note => note._id === noteId ? {...note, openTab: false}: note))

                setTabs(tabs.filter((tab) => tab._id !== noteId));
            }
        }
        catch (error){
            console.log(error);
        }
    }



    const setAsCurrentTab = async(noteId: string) => {
        setTabSwitch(true);
        try{
            const response = await fetch('http://localhost:8000/tab/select-tab', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem('jwtToken')!
                },
                body: JSON.stringify({
                    note_id: noteId
                })
            })
            if (response.status === 201){
                // first make the previous selected tab false then set the tab as selected tab with note id
                const updatedTab = tabs.map((tab) => {
                    return {
                        ...tab,
                        selectedTab: tab._id === _id
                    }
                });

                setTabs(updatedTab);
                //find the content of selected tab
                // and set the current tab content.
                const findSelectedTab = updatedTab.find((tab) => tab.selectedTab)
                if (findSelectedTab){
                    setContent(findSelectedTab.content || '');
                }
            }

        }
        catch(error){
            console.log(error);
        }
    }
    
    return (
        <Reorder.Item value={tab} draggable={true}>
        <div 
            className={selectedTab ? "current-tab" : "window"}
            // onClick = {() => setCurrentSelectedTab()}
            onMouseEnter={() => setButtonVisible(true)}
            onMouseLeave={() => setButtonVisible(false)}
        >
            <span
                className="tab-title"
                onClick={() => setAsCurrentTab(_id)}
            >
                {title}
            </span>
            <div
                className={ selectedTab ? "selected-tab-close-btn-container" : "close-btn-container"}
                onClick={() => closeOpenTab(_id)}
            >
                {
                    buttonVisible && <RxCross2 className = {selectedTab ? "selected-tab-close-btn" : "close-tab-btn"}/>
                }

            </div>
        </div>
        </Reorder.Item>
    )
    
}