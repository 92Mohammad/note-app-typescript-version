import mongoose from "mongoose";
import express from 'express'
const app = express();


export const connection = async () => {
    const port = process.env.PORT
    mongoose.connect(process.env.DB_STRING!)
        .then(() =>{
            console.log("Connected to database");
            app.listen(port, () => console.log('server is listening on port ' + port) );
        })
        .catch((err) => console.log("Error occurred!" , err));
}



