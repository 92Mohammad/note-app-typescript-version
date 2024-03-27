import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String
    },
    selectedTab: {
        type: Boolean,
        default: false
    },
    openTab: {
        type: Boolean,
        default: false
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

})

const Note = mongoose.model("Note", noteSchema)
export default Note