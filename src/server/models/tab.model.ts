import mongoose from "mongoose";

const tabSchema = new mongoose.Schema({
    title: {
        type: String
    },
    selectedTab: {
        type: Number
    },
  
    content: {
        type: String,
        default: ''
    },
    
    noteId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
        reqired: true

    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        reqired: true
    }
})

const Tabs = mongoose.model("Tab", tabSchema)
export default Tabs;