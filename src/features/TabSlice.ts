import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, TabsType, OpenTabParameter, selectNextTabParameter } from "../utils";
import { setNotes,  initialNoteState} from "./NoteSlice";
import { RootState } from '../app/store'

export interface TabsState {
    tabs: TabsType[],
    slectedTab: TabsType,
    errors: any;
}
const selectedTab_Inital_Value: TabsType = {
    _id: "",
    title: "",
    selectedTab: false,
    content: "",
    noteId: "",
}

const initialState: TabsState = {
    tabs: [],
    slectedTab: selectedTab_Inital_Value,
    errors: null
}

export const getTabs = createAsyncThunk('/tabs/getTabs', async(_, thunkAPI) => {
    try {
        const res = await fetch(`${BASE_URL}/tab/get-all-tabs`, {
          method: 'GET',
          headers: {
            "Content-Type": "applocation/json",
            "authorization": localStorage.getItem("authToken")!
          }
        })
        
        if (res.ok){    
            const allOpenTabs = await res.json()
            const selectedTab = allOpenTabs.find((tab : TabsType)=> tab.selectedTab)
            thunkAPI.dispatch(setSelectedTab(selectedTab))
            thunkAPI.dispatch(setTabs(allOpenTabs))
        }
        
    }
    catch(error: any){
        return thunkAPI.rejectWithValue(error);
    }

})

export const openTab = createAsyncThunk('/tabs/openTab', async(data: OpenTabParameter , thunkAPI) => {
    try{
        const {tabId, title} = data;
        const res = await fetch(`${BASE_URL}/tab/createNewTab`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "authorization": localStorage.getItem("authToken")!
          },
          body: JSON.stringify({noteId: tabId, title: title})
  
        })
        if (res.ok){
          const data = await res.json();
                    
          // 1. make isOpen property of note as true
          const notes = initialNoteState.notes;
          const updatedNoteArray = notes.map(note => note._id === tabId ? {...note, isOpen: true}: note)
          thunkAPI.dispatch(setNotes(updatedNoteArray));
  
          // 2. first set selectedTab property of all tab false
          const state = thunkAPI.getState() as RootState;
          const { tabs } = state.tabs;
          const updatedTab = tabs.map(tab => {
            return {
              ...tab,
              selectedTab: false
            }
          })
          // 3. create new tab
          const newTab = data.tab;
          // 4. setSelcted tab to newTab
          thunkAPI.dispatch(setSelectedTab(newTab))
  
          // 4. push the newTab into updatedTab
          updatedTab.push(newTab);  
          // 5. and then setTab() to updatedTab
          thunkAPI.dispatch(setTabs(updatedTab));
        }
  
      }
      catch(error: any){
        console.log(error.message)
        return thunkAPI.rejectWithValue(error)
      }

})

export const selectNextTab = createAsyncThunk('/tabs/selectNewTab', async(data: selectNextTabParameter, thunkAPI) => {

})

export const removeTab = createAsyncThunk('/tabs/removeTab', async() => {

})

export const tabSlice = createSlice({
    name: 'tabs',
    initialState,
    reducers: {
        setTabs: (state, action) => {
            console.log('all tabs: ', action.payload)
            state.tabs = action.payload;
        },
        setSelectedTab: (state, action) => {
            console.log('new selected tab : ', action.payload)
            state.slectedTab = action.payload;
            
        }
    },
    extraReducers: (builder) => {


    }
})

export default tabSlice.reducer;
export const { setTabs, setSelectedTab } = tabSlice.actions;
