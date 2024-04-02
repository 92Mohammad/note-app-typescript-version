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
    getAllOpenTab?: () => Promise<void>,
    openNewNoteEditor?: () => void
}

export interface Tab {
    _id: string,
    title: string,
    selectedTab: boolean
    content?: string,
}

export interface EditorProps {
    content: string;
    handleChange: (value: string) => void
}

export interface Note {
    _id: string,
    title: string
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
    notes: Note[]
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}
export interface WindowProps extends Tab, SideBarProps {
    tab: Tab,
    tabs: Tab[],
    setTabs: React.Dispatch<React.SetStateAction<Tab[]>>,
    setContent: React.Dispatch<React.SetStateAction<string>>
}

export interface AlertBoxProps {
    noteId: string,
    title: string,
    notes: Note[],
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>
    setIsOpenAlertBox: React.Dispatch<React.SetStateAction<boolean>>
}

export interface TabsListProps {
    tabs: Tab[],
    setTabs:  React.Dispatch<React.SetStateAction<Tab[]>>
    setContent: React.Dispatch<React.SetStateAction<string>>
}

export default function removeTab(tabs: Tab[]) {

}