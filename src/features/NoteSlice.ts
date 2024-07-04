import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NoteType, BASE_URL, createNoteProps } from "../utils";
import { RootState } from '../app/store'
import { getNextTab, editNoteTitleParameter } from "../utils";
import { setTabs } from "./TabSlice";


export interface NoteState {
  notes: NoteType[];
  noteTitle: string;
  deletedNoteInfo: {
    id: string,
    isDelete: boolean;
    isOpen: boolean 
  };
  isOpenAlertBox: boolean;
  errors: any;
}   
export const initialNoteState: NoteState = {
  notes: [],
  noteTitle: "",
  deletedNoteInfo: {
    id: "",
    isDelete: false,
    isOpen: false
  },
  isOpenAlertBox: false,
  errors: null,
};

export const fetchAllNotes = createAsyncThunk(
  "note/getAllNotes",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/note/getAllNotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
      });
      return await res.json();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewNote = createAsyncThunk(
  "note/createNewNote",
  async (
    { noteTitle, setNoteTitle, addNewNotes }: createNoteProps,
    thunkAPI
  ) => {
    try {
      if (noteTitle !== "") {
        const createNoteParameter = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("authToken")!,
          },
          body: JSON.stringify({ title: noteTitle }),
        };
        const res = await fetch(
          `${BASE_URL}/note/createNotes`,
          createNoteParameter
        );
        if (res.ok) {
          const data = await res.json();
          const newNote: NoteType = {
            _id: data.noteId,
            title: noteTitle,
            isOpen: false,
          };

          thunkAPI.dispatch(addNewNotes(newNote));
          thunkAPI.dispatch(setNoteTitle(""));
        }
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteNote = createAsyncThunk(
  "/notes/deleteNote",
  async (noteId: string, thunkAPI) => {
    
    const state = thunkAPI.getState() as RootState;
    const {tabs} = state.tabs;

    const tab = tabs.find(tab => tab._id === noteId);
    const nextTabId = tab && tab.isSelected ? getNextTab(tabs, tab._id)._id: "";

    try {
      const res = await fetch(`${BASE_URL}/note/delete-note`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({
          noteId: noteId,
          nextTabId
        }),
      });

      if (res.ok) {
        const { notes, deletedNoteInfo} = state.notes;
        if(tab && tab.isSelected){
          // 1. select next tab and filter the tab array
          const updatedTab = tabs.map(
            tab => tab._id === nextTabId ? {...tab, isSelected: true}: tab
          ).filter(tab => tab._id !== noteId);
    
          thunkAPI.dispatch(setTabs(updatedTab));

          // update notes array
          const updatedNoteArray = notes.filter(note => note._id !== noteId);
          thunkAPI.dispatch(setNotes(updatedNoteArray));

        }
        else if (tab && deletedNoteInfo.isOpen && !tab.isSelected ){
          // no need to select another tab
          // just update the tab and note array
          const updatedTabArray = tabs.filter(tab => tab._id !== noteId);
          thunkAPI.dispatch(setTabs(updatedTabArray));

          const updateNoteArray = notes.filter(note => note._id !== noteId);
          thunkAPI.dispatch(setNotes(updateNoteArray));
        }
        else {
          // means that tab is neither open nor selected 
          // just need to update note array
          const updatedNoteArray = notes.filter(note => note._id !== noteId);
          thunkAPI.dispatch(setNotes(updatedNoteArray));
        }
         
        // setOpen(false) for closing the AlertDialogBox
        thunkAPI.dispatch(setIsOpenAlertBox(false))

      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateTitle = createAsyncThunk('/notes/editNoteTitle', async({noteId, newTitle}: editNoteTitleParameter, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const { notes } = state.notes;
  const note = notes.find((note) => note._id === noteId);
  if (note && note.title !== newTitle) {
    try {
      const res = await fetch(
        `${BASE_URL}/note/update-note-title`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("authToken")!,
          },
          body: JSON.stringify({
            noteId: noteId,
            newTitle: newTitle,
          }),
        }
      );

      if (res.ok) {
        // 1. update the title from note array
        const updatedNoteArray = notes.map((note) =>
          note._id === noteId ? { ...note, title: newTitle } : note
        );
        thunkAPI.dispatch(setNotes(updatedNoteArray));

        // 2. update the title from tab array
        const { tabs} = state.tabs;
        const updatedTabArray = tabs.map((tab) =>
          tab._id === noteId ? { ...tab, title: newTitle } : tab
        );
        thunkAPI.dispatch(setTabs(updatedTabArray));
      }
    } catch (error: any) {
      console.log(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
})

export const noteSlice = createSlice({
  name: "notes",
  initialState: initialNoteState,
  reducers: {
    addNewNotes: (state, action) => {
      state.notes.push(action.payload);
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setNoteTitle: (state, action): void => {
      state.noteTitle = action.payload;
    },
    setIsDelete: (state, action: PayloadAction<{id: string, isDelete: boolean, isOpen: boolean}>) => {
      state.deletedNoteInfo = action.payload;
    },
    setIsOpenAlertBox: (state, action: PayloadAction<boolean>) => {
      state.isOpenAlertBox = action.payload;
    }
  
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllNotes.pending, (_, action) => {
      console.log(action.payload);
    });

    builder.addCase(fetchAllNotes.fulfilled, (state, action) => {
      const { messageType } = action.payload;
      if (messageType === "success") {
        const notes = action.payload.notes;
        state.notes = notes;
      } else {
        console.log("Error: ", action.payload);
      }
    });

    builder.addCase(fetchAllNotes.rejected, (state, action) => {
      state.errors = action.payload;
      console.log("Errors: ", state.errors);
    });
  },
});

export default noteSlice.reducer;
export const { setNoteTitle, addNewNotes, setNotes, setIsDelete, setIsOpenAlertBox } = noteSlice.actions;
