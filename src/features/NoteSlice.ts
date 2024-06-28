import { createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import { NoteType, BASE_URL, createNoteProps } from '../utils'

export interface noteState {
    notes: NoteType[];
    noteTitle: string;
}
const initialState: noteState = {
    notes: [],
    noteTitle: ""
}

export const fetchAllNotes = createAsyncThunk('note/getAllNotes', async() => {
    try{
        const res = await fetch(`${BASE_URL}/note/getAllNotes`, {
          method: 'GET',
          headers:{
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("authToken")!
          }
        })
        const data = await res.json();
        return data;
  
      }
      catch(error: any){
        console.log(error.message)
      }

})

export const createNewNote = createAsyncThunk('note/createNewNote', async({noteTitle, setNoteTitle, addNewNotes}: createNoteProps) => {
    try{

        if (noteTitle !== ""){
          
          const createNoteParameter = {
            method: 'POST',
            headers: {
              "Content-Type": 'application/json',
              "authorization": localStorage.getItem("authToken")!
            },
            body: JSON.stringify({title: noteTitle})
          }
          const res = await fetch(`${BASE_URL}/note/createNotes`, createNoteParameter)
          if (res.ok){
            const data = await res.json();

            const newNote: NoteType  = {
              _id: data.note_id,
              title: noteTitle,
              isOpen: false
            }

            addNewNotes(newNote);
            setNoteTitle('')

          }
        }
       
      }
      catch(error: any){
        console.log(error.message)
      }
})


export const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNewNotes: (state, action) => {
            console.log('This is new note: ', action.payload)
            state.notes.push = action.payload            
        },

        setNoteTitle: (state, action): void => {
            state.noteTitle = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllNotes.pending, () => {
                console.log('pending status')
            })
            .addCase(fetchAllNotes.fulfilled, (state, action) => {
                const {messageType} = action.payload;
                if (messageType === 'success'){
                    const notes = action.payload.notes
                    console.log(notes)
                    state.notes = notes;
                }
                else {
                    console.log("Error: ", action.payload)
                }

            })
            .addCase(fetchAllNotes.rejected, () => {
                console.log('Rejected  status')
            })
    }
})

export default noteSlice.reducer;
export const { setNoteTitle, addNewNotes } = noteSlice.actions;