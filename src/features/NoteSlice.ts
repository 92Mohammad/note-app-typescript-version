import { createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface NoteType {
    _id: string,
    title: string;
    isOpen?: boolean 
}
  
