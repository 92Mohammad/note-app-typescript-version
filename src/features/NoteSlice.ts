import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NoteType, BASE_URL, createNoteProps } from "../utils";
import { RootState } from '../app/store'
import { getNextTab, editNoteTitleParameter } from "../utils";
import { setSelectedTab, selectNextTab, setTabs } from "./TabSlice";

export interface NoteState {
  notes: NoteType[];
  noteTitle: string;
  previousId: string;
  errors: any;
}
export const initialNoteState: NoteState = {
  notes: [],
  noteTitle: "",
  previousId: "",
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
            _id: data.note_id,
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
    try {
      const res = await fetch(`${BASE_URL}/note/delete-note`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken")!,
        },
        body: JSON.stringify({ noteId: noteId }),
      });

      if (res.ok) {
        // 1. first update the notes array locally
        const state = thunkAPI.getState() as RootState;
        const { notes } = state.notes;
        console.log('inside delete function: ', notes)
        const remainingNote = notes.filter((note) => note._id !== noteId);
        thunkAPI.dispatch(setNotes(remainingNote));

        // 2. get the next tab to select
        const { tabs } = state.tabs;
        const removedTab = tabs.find((tab) => tab.noteId === noteId);

        if (removedTab) {
          const nextTab = getNextTab(tabs, removedTab._id);
          if (nextTab._id === "") {
            thunkAPI.dispatch(setSelectedTab(nextTab));
          } else {
            const { previousId } = state.notes
            thunkAPI.dispatch(selectNextTab({nextTab, previousId}));
          }
        }
        // 3. update the tabs array (remove the tab with noteId === above noteId)
        const remainingTabs = tabs.filter((tab) => tab.noteId !== noteId);
        thunkAPI.dispatch(setTabs(remainingTabs));
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editNoteTitle = createAsyncThunk('/notes/editNoteTitle', async({noteId, newTitle}: editNoteTitleParameter, thunkAPI) => {
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
        const updatedTabsArray = tabs.map((tab) =>
          tab.noteId === noteId ? { ...tab, title: newTitle } : tab
        );
        thunkAPI.dispatch(setTabs(updatedTabsArray));
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
    setPreviousId: (state, action) => {
      state.previousId = action.payload;
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
        console.log(notes);
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
export const { setNoteTitle, addNewNotes, setNotes, setPreviousId } = noteSlice.actions;
