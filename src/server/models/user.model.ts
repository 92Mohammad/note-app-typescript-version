import { Schema, model } from "mongoose";

export interface User {
    username: string;
    email: string;
    password: string
}

const userSchema = new Schema<User>({
    username: {type: String, require: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const User = model("User", userSchema)

export default User;