import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  BASE_URL,
  TabsType,
  OpenTabParameter,
  selectNextTabParameter,
  saveContentParameter
} from "../utils";
import { setNotes } from "./NoteSlice";
import { RootState } from "../app/store";
import { getNextTab } from "../utils";

export interface TabsState {
  tabs: TabsType[];
  selectedTab: TabsType;
  errors: any;
}
const selectedTab_Inital_Value: TabsType = {
  _id: "",
  title: "",
  selectedTab: false,
  content: "",
  noteId: "",
};

const initialState: TabsState = {
  tabs: [],
  selectedTab: selectedTab_Inital_Value,
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
        const allOpenTabs = await res.json();
        console.log("tabs recieved from server : ", allOpenTabs);
        // const selectedTab = allOpenTabs.find((tab: TabsType) => tab.selectedTab);

        
        // thunkAPI.dispatch(setSelectedTab(selectedTab));
        thunkAPI.dispatch(setTabs(allOpenTabs));
        
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const openTab = createAsyncThunk(
  "/tabs/openTab",
  async (data: OpenTabParameter, thunkAPI) => {
    try {
      const { tabId, title } = data;
      const res = await fetch(`${BASE_URL}/tab/createNewTab`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({ noteId: tabId, title: title }),
      });
      if (res.ok) {
        const data = await res.json();
        const state = thunkAPI.getState() as RootState;
        // 1. make isOpen property of note as true
        const { notes } = state.notes;
        console.log('this is notes inside open tab: ', notes);
        const updatedNoteArray = notes.map((note) =>note._id === tabId ? { ...note, isOpen: true } : note);
        thunkAPI.dispatch(setNotes(updatedNoteArray));

        // 2. first set selectedTab property of all tab false
        
        const { tabs } = state.tabs;
        const updatedTab = tabs.map((tab) => {
          return {
            ...tab,
            selectedTab: false,
          };
        });
        // 3. create new tab
        const allTabs = data.tabs;
        thunkAPI.dispatch(setTabs(allTabs));
        // // 4. setSelcted tab to newTab
        // thunkAPI.dispatch(setSelectedTab(newTab));

        // // 4. push the newTab into updatedTab
        // updatedTab.push(newTab);
        // // 5. and then setTab() to updatedTab
        // thunkAPI.dispatch(setTabs(updatedTab));
      }
    } catch (error: any) {
      console.log(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const selectNextTab = createAsyncThunk(
  "/tabs/selectNewTab",
  async (data: selectNextTabParameter, thunkAPI) => {
    const { nextTab, previousId } = data;

    const state = thunkAPI.getState() as RootState;
    const { tabs } = state.tabs;

    if (nextTab._id !== "") {
      try {
        if (previousId !== "") {
          // save the content of previousId first
          thunkAPI.dispatch(saveContent({tabs, previousId}));
        }
        const res = await fetch(`${BASE_URL}/tab/select-next-tab`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tabId: nextTab._id,
            previousTabId: previousId,
          }),
        });

        if (res.ok) {
          // 2. set tab as selecteTab
          // 3. find the content of currentTab from tabs array

          const tab = tabs.find((tab) => tab._id === nextTab._id);
          if (tab) {
            console.log('next tab: ', nextTab)
            thunkAPI.dispatch(setSelectedTab({
              ...nextTab,
              content: tab.content,
              selectedTab: true,
            }));
          }
          console.log('selected tab in function: ')
        }
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error);
      }
    } else {
      //means that nextTab is null (means that there is no tab to select)
    }
  }
);

export const removeTab = createAsyncThunk(
  "/tabs/removeTab",
  async (tabId: string, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/tab/remove-tab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({ tabId: tabId }),
      });
      if (res.ok) {
        // 1. change the selection of tab
        // When you will get the next tab and select next tab(ans is when you are going to remove the current selecte tab)
        // otherwise just rmove/filter the tab array

        // So first find the noteId from tab array
        const state = (await thunkAPI.getState()) as RootState;
        const { notes, previousId } = state.notes;
        const { tabs } = state.tabs;

        const removedTab: TabsType[] = tabs.filter((tab) => tab._id === tabId);
        if (removedTab[0].selectedTab) {
          const nextTab = getNextTab(tabs, tabId);
          if (nextTab._id === "") {
            thunkAPI.dispatch(setSelectedTab(nextTab));
          } else {
            thunkAPI.dispatch(selectNextTab({ nextTab, previousId }));
          }
        }

        // 2. then remove the tab with tab id
        const remainingTab = tabs.filter((tab) => tab._id !== tabId);
        thunkAPI.dispatch(setTabs(remainingTab));

        // 3. Now make the isOpen property of note as false so that we can re-open it
        if (removedTab) {
          const updatedNoteArray = notes.map((note) =>
            note._id === removedTab[0].noteId
              ? { ...note, isOpen: false }
              : note
          );
          thunkAPI.dispatch(setNotes(updatedNoteArray));
        }
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
    setSelectedTab: (state, action) => {
      console.log("new selected tab : ", action.payload);
      state.selectedTab = action.payload;
      console.log('after selection of tab: ', state.selectedTab )
    },
    onOpenSetTab: (state, action) => {

    }
  },
  
});

export default tabSlice.reducer;
export const { setTabs, setSelectedTab } = tabSlice.actions;
