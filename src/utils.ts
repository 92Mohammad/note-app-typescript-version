import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface User {
    username: string;
    email?: string;
    password: string
}

export interface NoteType {
    _id: string,
    title: string;
    isOpen?: boolean 
}
export interface TabsType extends NoteType {
    selectedTab: boolean;
    content: string;
    noteId: string;
  }

export type createNoteProps = {
    noteTitle: string,
    setNoteTitle: ActionCreatorWithPayload<string>,
    addNewNotes:  ActionCreatorWithPayload<NoteType>,
}

export interface OpenTabParameter {
    tabId: string,
    title: string
}
export interface selectNextTabParameter{
    nextTab: TabsType,
    previousId: string
}
  
export interface saveContentParameter {
    tabs: TabsType[],
    previousId: string
}

export interface editNoteTitleParameter {
    noteId: string;
    newTitle: string
}
export const BASE_URL = 'http://localhost:8000'

export const getNextTab = (tabs: TabsType[], tabId: string): TabsType => {
    const tab = tabs.find(tab => tab._id === tabId);
    const indexOfTab = tabs.indexOf(tab!);
    const nullValues:TabsType = {
        _id: '',
        title: '',
        selectedTab: false,
        content: '',
        noteId: ""
    } 
    if (tab && tab.selectedTab){
        if(indexOfTab == 0 && tabs.length > 1) {
            // selectNextTab(tabs[indexOfTab + 1], previousId);
                return tabs[indexOfTab + 1];
            }
            else if ((indexOfTab == tabs.length - 1 && tabs.length > 1) || tabs.length > 2){
            // selectNextTab(tabs[indexOfTab - 1], previousId);
                return tabs[indexOfTab - 1];
            }
        }
    return nullValues;
}


