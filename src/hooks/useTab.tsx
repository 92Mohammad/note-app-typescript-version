import { useState } from "react";
import { NoteType, TabsType } from "../pages/NotePage";

import { getNextTab } from "../utils";


interface useTabProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<TabsType>>,
  notes: NoteType[]
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>,
  saveContent: (tabs: TabsType[]) => void,
  previousId: string
}

type useFetchTabsReturnType = {
  tabs: TabsType[],
  setTabs: React.Dispatch<React.SetStateAction<TabsType[]>>,
  getAllTabs: () => void,
  openNewTab: (tabId: string, title: string) => void,
  selectNextTab: (nextTab: TabsType, previousId: string ) => Promise<void>,
  removeTab: (tabId: string) => Promise<void>,


}

export const useTab = ({setSelectedTab, notes, setNotes, saveContent, previousId}: useTabProps): useFetchTabsReturnType => {

    const[tabs, setTabs] = useState<TabsType[]>([]);
    

    const getAllTabs = async() => {
        try {
          const res = await fetch('http://localhost:8000/tab/get-all-tabs', {
            method: 'GET',
            headers: {
              "Content-Type": "applocation/json",
              "authorization": localStorage.getItem("authToken")!
            }
          })
          
          if (res.ok){
            const allOpenTabs = await res.json()
            const selectedTab = allOpenTabs.find((tab : TabsType)=> tab.selectedTab)
            setSelectedTab(selectedTab)
            setTabs(allOpenTabs)
          }
          
        }
        catch(error: any){
          console.log(error.message)
        }
    
    }

    const openNewTab = async(tabId: string, title: string) => {
      try{
        
        const res = await fetch('http://localhost:8000/tab/createNewTab', {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "authorization": localStorage.getItem("authToken")!
          },
          body: JSON.stringify({noteId: tabId, title: title})
  
        })
        if (res.ok){
          const data = await res.json();
                    
          // 1. make isOpen property of note as true
          setNotes(notes.map(note => note._id === tabId ? {...note, isOpen: true}: note));
  
          // 2. first set selectedTab property of all tab false
          const updatedTab = tabs.map(tab => {
            return {
              ...tab,
              selectedTab: false
            }
          })
          // 3. create new tab
          const newTab = data.tab;
          // 4. setSelcted tab to newTab
          setSelectedTab(newTab)
  
          // 4. push the newTab into updatedTab
          updatedTab.push(newTab);  
          // 5. and then setTab() to updatedTab
          setTabs(updatedTab);
        }
  
      }
      catch(error: any){
        console.log(error.message)
      }
     
    }

    const selectNextTab  = async(nextTab: TabsType, previousId: string) => {
      if (nextTab._id !== ""){
        try {
          if (previousId !== "") {
            // save the content of previousId first
            saveContent(tabs)
          }
          const res = await fetch('http://localhost:8000/tab/select-next-tab',{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({tabId: nextTab._id, previousTabId: previousId})
          })
          
          if (res.ok){
            
            // 2. set tab as selecteTab
            // 3. find the content of currentTab from tabs array
            const tab = tabs.find(tab => tab._id === nextTab._id)
            if (tab ) {
              setSelectedTab({...nextTab, content: tab.content,  selectedTab: true});
            }
    
          }
        }
        catch(error: any){
          console.log(error.message)
        }
      }
      else {
        //means that nextTab is null (means that there is no tab to select)
        
      }
      
    }


    const removeTab = async(tabId: string) => {
      try{
        const res = await fetch('http://localhost:8000/tab/remove-tab', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem('authToken')!
          },
          body: JSON.stringify({tabId: tabId})
  
        })
        if (res.ok){

          // 1. change the selection of tab
          // When you will get the next tab and select next tab(ans is when you are going to remove the current selecte tab)
          // otherwise just rmove/filter the tab array

          // So first find the noteId from tab array 

          const removedTab: TabsType[] = tabs.filter(tab => tab._id === tabId);
            if (removedTab[0].selectedTab){
              const nextTab = getNextTab(tabs, tabId);
            if (nextTab._id === ''){
              setSelectedTab(nextTab);
            }
            else {
              selectNextTab(nextTab, previousId);
            }
          }
          

          // 2. then remove the tab with tab id
          const remainingTab =  tabs.filter(tab => tab._id !== tabId);
          setTabs(remainingTab)

          
        // 3. Now make the isOpen property of note as false so that we can re-open it
         if (removedTab){
          setNotes(notes.map(note => note._id === removedTab[0].noteId ? {...note, isOpen: false} : note));
         }
        }
      }
      catch(error: any){
        console.log(error.message)
      }   
    }
  return { tabs, setTabs, getAllTabs, openNewTab , selectNextTab, removeTab};
    
}