import React from 'react'
import SideBar from '../components/SideBar' // this is child2
import Window from '../components/Window'
import Editor from '../components/Editor'
import Button from '@mui/material/Button';
import '../css/note.css'
import { useState, useEffect } from 'react'
import { Tab, Note } from '../utils'
import { Reorder, AnimatePresence } from "framer-motion"

const Tabs = [
    {
        _id: "1",
        title: 'server.ts',
        content: 'this is server file',
        selectedTab: false,
        openTab: true
    },
    {
        _id: "2",
        title: 'tabRoute.ts',
        content: 'this is tab route file',
        selectedTab: false,
        openTab: true
    },
    {
        _id: "3",
        title: 'NotePage.tsx',
        content: 'this is Note page file',
        selectedTab: false,
        openTab: true
    },
    

]
export default function NotePage() {
    const [tabs, setTabs] = useState<Tab[]>([]);

      const [notes, setNotes] = useState<Note[]>([]);
    const [content , setContent] = useState<string>('');
    const[currentSelectedTab, setCurrenSelectedTab] = useState<Tab>(tabs[0])
    const[switchTab, setSwitchTab] = useState<boolean>(false);
    

    console.log('current open tabs are: ', tabs)

    const handleChange = (value: string) => {
        setContent(value);  
        const findSelectedTab = tabs.find(tab => tab.selectedTab);
        if(findSelectedTab){
            setTabs(tabs.map(tab => tab._id === findSelectedTab._id ? {...tab, content: value}: tab))
        }
    };
    

    const getAllOpenTab = async() => {
        try {
            const response = await fetch('http://localhost:8000/tab/getAllOpenTab', {
                method : 'GET',
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("jwtToken")!
                }
            })

            if (response.status === 200){
                const data = await response.json()
                setTabs(data);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
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
            const currentTab = tabs.filter((tab) => tab.selectedTab)
            const noteIdOfCurrentTab = currentTab[0]._id;

            const response = await fetch('http://localhost:8000/content/saveContent', {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem('jwtToken')!
                },
                body: JSON.stringify({
                    noteContent: content,
                    noteId: noteIdOfCurrentTab
                })
            })
            if (response.status == 201){


            }

        }
        catch(error: any){
            console.log("Error: ", error.message)
        }
    }


    
  const getContent = async() => {
    try {
      const response = await fetch('http://localhost:8000/content/getContent', {
        method: "GET",
          headers: {
            "Content-Type": 'application/json',
             authorization: localStorage.getItem('jwtToken')!
          }
      })
      if (response.status === 200){
        const contentData = await response.json();
        setContent(contentData);
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
                tabs = {tabs}
                setTabs = {setTabs}
                notes = {notes}
                setNotes = {setNotes}
            />
            <div className='rigth-section'>
                <div className='tabs-and-save-btn'>
                    <Reorder.Group axis="x" values={tabs} onReorder={setTabs}>
                    <div className='window-container'>
                        <AnimatePresence initial={false}>
                        {tabs.length !== 0 && tabs.map((tab, index) => {
                            return <Window
                                key={index}
                                _id = {tab._id}
                                title ={tab.title}
                                selectedTab = {tab.selectedTab}
                                setContent={setContent}
                                tab = {tab}
                                tabs = {tabs}
                                setTabs = { setTabs }
                                currentSelectedTab = {currentSelectedTab}
                                setCurrentSelectedTab = {setCurrenSelectedTab}
                                setTabSwitch={setSwitchTab}
                                notes = {notes}
                                setNotes = {setNotes}

                            />
                            
                        })
                        }
                        </AnimatePresence>
                    </div>
                    </Reorder.Group>
                    <div className='save-content-btn-div'>
                        {/* <Button
                            variant="contained"
                            style = {{backgroundColor: 'rgb(255, 255, 201)', color: 'black'}}
                            onClick = {() => saveContent() }
                            size = "medium"
                        >
                            Save
                        </Button> */}
                    </div>
                </div>
                <div className='Writes-and-edit-notes-contianer'>
                    <Editor content = {content} handleChange = {handleChange}/>
                </div>
            </div>
        </main>

    )       
}


