import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "../features/userSlice";
import notesReducer from '../features/NoteSlice'
import tabReducer  from '../features/TabSlice'
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        users: userReducer,
        notes: notesReducer,
        tabs: tabReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()
