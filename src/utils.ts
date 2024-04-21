import React from 'react'

export interface User {
    username: string
    email?: string,
    password: string
}

export interface RequestParameter {
    method: string,
    headers: HeadersInit,
    body?: string
}

export interface SideBarProps {
    tabs: Tab[],
    setTabs:  React.Dispatch<React.SetStateAction<Tab[]>>,
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>,
    getAllOpenTab?: () => Promise<void>,
    openNewNoteEditor?: () => void
}

export interface Tab {
    _id: string,
    title: string,
    selectedTab: boolean
    content?: string;
}

export interface EditorProps {
    content: string;
    handleChange: (value: string) => void
}

export interface Note {
    _id: string,
    title: string;
    openTab: boolean;
}

export interface InputBoxProps {
    createNotes: (title: string) => Promise<void>
}

export interface ButtonProps {
    openInputBox: () => void
}

export interface NotesProps extends SideBarProps {
    noteId: string,
    title: string,
    notes: Note[],
    isOpen: boolean;
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}
export interface WindowProps extends Tab, SideBarProps {
    tab: Tab,
    tabs: Tab[],
    setTabs: React.Dispatch<React.SetStateAction<Tab[]>>,
    setContent: React.Dispatch<React.SetStateAction<string>>
    currentSelectedTab: Tab;
    setCurrentSelectedTab:  React.Dispatch<React.SetStateAction<Tab>>,
    setTabSwitch: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface AlertBoxProps {
    noteId: string,
    title: string,
    notes: Note[],
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>
    setIsOpenAlertBox: React.Dispatch<React.SetStateAction<boolean>>;
    tabs: Tab[];
    setTabs:  React.Dispatch<React.SetStateAction<Tab[]>>
}

export interface TabsListProps {
    tabs: Tab[],
    setTabs:  React.Dispatch<React.SetStateAction<Tab[]>>
    setContent: React.Dispatch<React.SetStateAction<string>>
}

export default function removeTab(tabs: Tab[], setTabs: React.Dispatch<React.SetStateAction<Tab[]>>, noteId: string) {
    // also set the selectedTab property to another tab
    if (tabs[0]._id === noteId && tabs.length > 1){
        setTabs(tabs.map((tab, index ) => index === 1 ? {...tab, selectedTab: true}: {...tab, selectedTab: false}))
    }

    if (tabs[tabs.length - 1]._id === noteId && tabs.length > 1){
        setTabs(tabs.map((tab, index ) => index === tabs.length - 2 ? {...tab, selectedTab: true}: {...tab, selectedTab: false}))
    }
    else {
        for (let i = 0; i < tabs.length; i++    ){
            if (tabs[i]._id === noteId  && tabs.length > 2){
                setTabs(tabs.map((tab, index ) => index === i - 1 ? {...tab, selectedTab: true}: {...tab, selectedTab: false}))

            }
        }
    }

    setTabs(tabs.filter(tab => tab._id !== noteId));
 
}