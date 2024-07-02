import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  BASE_URL,
  TabsType,
  saveContentParameter
} from "../utils";
import { setNotes } from "./NoteSlice";
import { RootState } from "../app/store";


export interface TabsState {
  tabs: TabsType[];
  previousId: string;
  errors: any;
}


const initialState: TabsState = {
  tabs: [],
  previousId: "",
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
        console.log("tabs recieved from server : ", allOpenTabs);

        const findPreviousId = allOpenTabs.find(tab => tab.isSelected);
        thunkAPI.dispatch(setPreviousId(findPreviousId && findPreviousId._id))

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
        console.log(data)
        const state = thunkAPI.getState() as RootState;
        // 1. make isOpen property of note as true
        const { notes } = state.notes;
        console.log('this is notes inside open tab: ', notes);
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
  async (nextTab: TabsType, thunkAPI) => {
    // const { nextTab } = data;

    const state = thunkAPI.getState() as RootState;
    const { tabs, previousId } = state.tabs;
    console.log('previous id in selecte next tab: ', previousId);

    

    try {
      // find the content of previousTab 
      const findContent = tabs.find(tab => tab._id === previousId);
      console.log('content tab in select next tab: ', findContent)
      const res = await fetch(`${BASE_URL}/tab/select-next-tab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({
          tabId: nextTab._id,
          previousTabId: previousId,
          content:  findContent?.content
        }),
      });
      const data = await res.json();
      console.log("response: ", data);

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
  async (tabId: string, thunkAPI) => {

    const state = thunkAPI.getState() as RootState;
    const { tabs , previousId} = state.tabs;
    const findTabContent = tabs.find(tab => tab._id === tabId);
    
    try {
      const res = await fetch(`${BASE_URL}/tab/remove-tab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({
          tabId: tabId,
          previousTabId: previousId,
          content: findTabContent ? findTabContent.content : "" 
        }),
      });
      if (res.ok) {
        const data = await res.json() ;
        thunkAPI.dispatch(setTabs(data.updatedTab as TabsType[]));

        // now set isOpen = false in notes array;
        const { notes } = state.notes;
        const updatedNoteArray = notes.map(note => note._id == tabId ? {...note, isOpen: false}: note);
        thunkAPI.dispatch(setNotes(updatedNoteArray));

        // const state = (await thunkAPI.getState()) as RootState;
        // const { notes, previousId } = state.notes;
        // const { tabs } = state.tabs;

        // const removedTab: TabsType[] = tabs.filter((tab) => tab._id === tabId);
        // if (removedTab[0].selectedTab) {
        //   const nextTab = getNextTab(tabs, tabId);
        //   if (nextTab._id === "") {
        //     thunkAPI.dispatch(setSelectedTab(nextTab));
        //   } else {
        //     thunkAPI.dispatch(selectNextTab({ nextTab, previousId }));
        //   }
        // }

        // // 2. then remove the tab with tab id
        // const remainingTab = tabs.filter((tab) => tab._id !== tabId);
        // thunkAPI.dispatch(setTabs(remainingTab));

        // // 3. Now make the isOpen property of note as false so that we can re-open it
        // if (removedTab) {
        //   const updatedNoteArray = notes.map((note) =>
        //     note._id === removedTab[0].noteId
        //       ? { ...note, isOpen: false }
        //       : note
        //   );
        //   thunkAPI.dispatch(setNotes(updatedNoteArray));
        // }
      }
    } catch (error: any) {
      console.log(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const saveContent = createAsyncThunk('/tabs/saveContent', async({tabs, previousId}:saveContentParameter, thunkAPI) => {
    try {
        
        const previousTab = tabs.find(tab => tab._id === previousId)
        if (previousTab){
    
          await fetch(`${BASE_URL}/tab/save-content`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({tabId: previousId, content: previousTab?.content})
          })            
        }
        else {
          console.log('previous tab does not exist')
        }
        
      }
      catch(error: any){
        console.log(error.message);
      }
})

export const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setTabs: (state, action) => {
      console.log("all tabs: ", action.payload);
      state.tabs = action.payload;
      console.log('after setting the tabs: ', state.tabs);
    },
    setPreviousId: (state, action) => {
      state.previousId = action.payload;
    }
    // setSelectedTab: (state, action) => {
    //   console.log("new selected tab : ", action.payload);
    //   state.selectedTab = action.payload;
    //   console.log('after selection of tab: ', state.selectedTab )
    // },
    // onOpenSetTab: (state, action) => {
    //   // const { updatedNoteArray, updatedTabArray} = action.payload;
    //   // state.tabs = updatedTabArray;
      

    // }
  },
  
});

export default tabSlice.reducer;
export const { setTabs, setPreviousId } = tabSlice.actions;
