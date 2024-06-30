import { Schema, model } from "mongoose";

export interface Note {
    title: string;
    isOpen: boolean,
    isSelected: boolean;
    content: string;
    userId: Schema.Types.ObjectId;
}

const noteSchema = new Schema<Note>({
    title: {type: String, required: true},
    isOpen: {type: Boolean, default: false},
    isSelected: {type: Boolean, default: false},
    content: {type: String, default: ''},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Notes = model('Notes', noteSchema);
export default Notes;