import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NoteType, BASE_URL, createNoteProps } from "../utils";

export interface NoteState {
  notes: NoteType[];
  noteTitle: string;
  errors: any;
}
const initialState: NoteState = {
  notes: [],
  noteTitle: "",
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
      console.log(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNewNotes: (state, action) => {
      state.notes.push(action.payload);
    },

    setNoteTitle: (state, action): void => {
      state.noteTitle = action.payload;
    },
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
    });
  },
});

export default noteSlice.reducer;
export const { setNoteTitle, addNewNotes } = noteSlice.actions;
