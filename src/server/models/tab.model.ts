import mongoose from "mongoose";

const tabSchema = new mongoose.Schema({
    selectedTab: {
        type: Number
    },
    openTab: {
        type: Number
    },
    noteId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }
})

const Tabs = mongoose.model("Tab", tabSchema)
export default Tabs;