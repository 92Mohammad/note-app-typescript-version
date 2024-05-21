import { TabsType } from '../pages/NotePage'
import { useState} from 'react'

interface EditorProps {
    selectedTab: TabsType;
    setSelectedTab: React.Dispatch<React.SetStateAction<TabsType>>
    tabs: TabsType[];
    setTabs: React.Dispatch<React.SetStateAction<TabsType[]>>
    setPreviousId:  React.Dispatch<React.SetStateAction<string>>
}


export const Editor = ({selectedTab, setSelectedTab, tabs, setTabs, setPreviousId}: EditorProps) => {
    
    
    

    const handleContent = (content: string)=> {
        setPreviousId(selectedTab._id)
        // 1. first set the content of tabs 
        setTabs(tabs.map(tab => tab._id === selectedTab._id ? {...tab, content: content}: tab))

        // 2. set the selectedTab content property over here
        setSelectedTab({...selectedTab, content: content});

    }
    console.log(selectedTab && selectedTab.content)
    return (
        <div>
            <textarea 
                value= { selectedTab &&  selectedTab.content }
                name="textarea" 
                id="textarea" 
                cols= {50}
                rows= {30} 
                className="w-full bg-gray-900 px-2 py-2 border-2 outline-none rounded-md"
                onChange = {(e) => handleContent(e.target.value) }
            >

            </textarea>
        </div>
    )
}