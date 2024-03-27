import '../css/window.css'
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import {RequestParameter, WindowProps} from "../utils";

export default function Window({_id, title, selectedTab, getContent, getAllOpenTab}: WindowProps ){
    // const [currentTab, setCurrentTab] = useState({})
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
                await getAllOpenTab();
            }
        }
        catch (error){
            console.log(error);
        }
    }
   

    const setAsCurrentTab = async(noteId: string) => {
        try{
            const response = await fetch('http://localhost:8000/tab/select-tab', {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    note_id: noteId
                })
            })
            if (response.status === 200){ 
                // here when getAllOpenTab function will call it will get the new currentTab so React Dom will 
                // change the prev current tab to new current tab. 
                await getAllOpenTab();
                // here I have to call the getContent method so that when currentTab change 
                // it should get the content of new currentTab
                await getContent();
            }
        }
        catch(error){
            console.log(error);
        }
    }
    
    return (
        <div 
            className={selectedTab ? "current-tab" : "window"}
            onClick={() => setAsCurrentTab(_id)}
        >
            <span className="title">{title}</span>
            <div  className={ selectedTab ? "current-tab-close-btn" : "close-btn"} >
                <RxCross2 onClick={() => closeOpenTab(_id)}/>
            </div>
        </div>
    )
    
}