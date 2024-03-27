import React from 'react'
import SideBar from '../components/SideBar' // this is child2
import Window from '../components/Window'   // this is child1 
import Editor from '../components/Editor'
import '../css/note.css'
import { useState, useEffect } from 'react'
import { Tab } from '../utils'


export default function NotePage() {
    const [editor, setEditor] = useState([])
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [content , setContent] = useState<string>('');

    const handleChange = (value: string) => {
        setContent(value);  
    };
    
    // const openEditor = (Title: string, Id: number): void => {
    //     setEditor((prevEditor) => [...prevEditor, {}])
    // }
    //
    const getAllOpenTab = async() => {
        try {
            const response = await fetch('http://localhost:8000/getAllOpenTab', {
                method : 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.status === 200){
                const data = await response.json()
                console.log('get all open all tab: ',data)
                setTabs(data);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        // calling the getAllOpenTab function to get the open tab list
        getAllOpenTab();
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("jwtToken")
        if (!token) {
            window.location.href = "/login"
        }
    }, [])

    const saveContent = async() => {
        try{
            // first find the note_id of the current tab
            const currentTab = tabs.filter((tab) => tab.selectedTab === 1)
            const noteIdOfCurrentTab = currentTab[0]._id;


            const response = await fetch('http://localhost:8000/note/saveContent', {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    noteContent: content,
                    noteId: noteIdOfCurrentTab
                })
            })
        }
        catch(error){
            console.log(error)
        }
    }


    
  const getContent = async() => {
    try {
      const response = await fetch('http://localhost:8000/note/getContent', {
        method: "GET"
      })
      if (response.status === 200){
        const contentData = await response.json();
        const noteContent = contentData.note_content;
        setContent(noteContent);
      }
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    getContent();
  }, [])


    return (
        <main>
            <SideBar
                getAllOpenTab = {getAllOpenTab}
                // openNewNoteEditor = {openEditor}
            />
            <div className='rigth-section'>
                <div className='tabs-and-save-btn'>
                    <div className='window-container'>
                        {tabs.map((tab, index) => {
                            return <Window
                                key={index}
                                _id = {tab._id}
                                title ={tab.title}
                                selectedTab = {tab.selectedTab}
                                getAllOpenTab = {getAllOpenTab}
                                getContent = {getContent}
                            />
                        })}
                    </div>
                    <div className='save-content-btn-div'><button onClick = {saveContent}className='save-content-btn'>Save</button></div>
                </div>
                <div className='Writes-and-edit-notes-contianer'>
                    {/* {isTabOpen ? <Editor /> : <EditorBackground />} */}
                    <Editor content = {content} handleChange = {handleChange}/>

                </div>
            </div>
        </main>
    )       
}


function EditorBackground() {
    return (
        <>
            <div className='default-page-with-no-editor'>
                <h1>Write your thoughts</h1>
            </div>
        </>
    )
}


