import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        default: ""
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

})

const Note = mongoose.model("Note", noteSchema)
export default Note

// isOpen => it tracks whether a note is open or not(and indirectly tab is open or not), if note will open this will be true , 
// user will try to open it again the note/tab will not open two time/or more than two 
