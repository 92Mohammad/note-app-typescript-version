import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  BASE_URL,
  TabsType,
  selectNextTabParameter,
  getNextTab

} from "../utils";
import { setNotes } from "./NoteSlice";
import { RootState } from "../app/store";


export interface TabsState {
  tabs: TabsType[];
  currentTab: TabsType;
  errors: any;
}

const initialCurrentTabValue: TabsType = {
  isSelected: false,
  content: "",
  _id: "",
  title: ""
}

const initialState: TabsState = {
  tabs: [],
  currentTab: initialCurrentTabValue,
  errors: null,
};

export const getTabs = createAsyncThunk(
  "/tabs/getTabs",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/tab/getTabs`, {
        method: "GET",
        headers: {
          "Content-Type": "applocation/json",
          authorization: localStorage.getItem("authToken")!,
        },
      });

      if (res.ok) {
        const allOpenTabs: TabsType[] = await res.json();

        thunkAPI.dispatch(setTabs(allOpenTabs));
        
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const openTab = createAsyncThunk(
  "/tabs/openTab",
  async (tabId: string, thunkAPI) => {
    try {

      const res = await fetch(`${BASE_URL}/tab/createNewTab`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({ noteId: tabId}),
      });
      if (res.ok) {
        const data = await res.json();
        const state = thunkAPI.getState() as RootState;
        // 1. make isOpen property of note as true
        const { notes } = state.notes;

        const updatedNoteArray = notes.map((note) =>note._id === tabId ? { ...note, isOpen: true } : note);
        thunkAPI.dispatch(setNotes(updatedNoteArray));

        thunkAPI.dispatch(setTabs(data.tabs as TabsState[]))
      }
    } catch (error: any) {
      console.log(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);



export const selectNextTab = createAsyncThunk(
  "/tabs/selectNewTab",
  async ({nextTab, previousTabId, previousTabContent }: selectNextTabParameter , thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/tab/select-next-tab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({
          tabId: nextTab._id,
          previousTabId,
          content: previousTabContent
        }),
      });
      const data = await res.json();

      if (res.ok) {
        // 2. set tab as selecteTab
        // 3. find the content of currentTab from tabs array
        thunkAPI.dispatch(setTabs(data.updatedTabArray as TabsType))
        
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  
  }
);

export const removeTab = createAsyncThunk(
  "/tabs/removeTab",
  async (tab: TabsType, thunkAPI) => {

    const state = thunkAPI.getState() as RootState;
    const { tabs } = state.tabs;
    const nextTabId: string = tab.isSelected ? getNextTab(tabs, tab._id)._id : "";
    const currentTabContent: string = tab.isSelected ? tab.content : "";
    
    try {
      const res = await fetch(`${BASE_URL}/tab/remove-tab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({
          tabId: tab._id,
          nextTabId,
          content: currentTabContent
        }),
      });
      if (res.ok) {
        const data = await res.json() ;

        const updatedTabs: TabsType[] = data.updatedTabs;

        thunkAPI.dispatch(setTabs(updatedTabs));
        
        // now set isOpen = false in notes array;
        const { notes } = state.notes;
        const updatedNoteArray = notes.map(note => note._id == tab._id ? {...note, isOpen: false}: note);
        thunkAPI.dispatch(setNotes(updatedNoteArray));
      }
    } catch (error: any) {
      console.log(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setTabs: (state, action) => {
      state.tabs = action.payload;
      
    },
    updateNoteContent: (state, action: PayloadAction<{id: string, content: string}>) => {
      const {id, content} = action.payload;
      const tab = state.tabs.find(tab => tab._id == id);
      if (tab){
        tab.content = content;
      }
    } 
  },
  
});

export default tabSlice.reducer;
export const { setTabs, updateNoteContent } = tabSlice.actions;
