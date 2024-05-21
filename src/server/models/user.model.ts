import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

})

const User = mongoose.model("User", userSchema)

export default User;