import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "../features/userSlice";
import notesReducer from '../features/NoteSlice'
// import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        users: userReducer,
        notes: notesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>()
