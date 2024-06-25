import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface User {
    username: string;
    email?: string;
    password: string
}

const initialState: User = {
    username: "",
    email: "",
    password: ""
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
    }
})
