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
    getAllOpenTab: () => Promise<void>,
    openNewNoteEditor?: () => void
}

export interface Tab {
    _id: string,
    title: string,
    selectedTab: number
}

export interface EditorProps {
    content: string,
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
    getContent: () => Promise<void>
}