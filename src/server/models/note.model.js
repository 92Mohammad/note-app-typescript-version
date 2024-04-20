"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var noteSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
});
var Note = mongoose_1.default.model("Note", noteSchema);
exports.default = Note;
