require("dotenv").config()
import express from 'express'
const app = express()
const port = process.env.PORT
import userRoute from './routes/userRoute'
import noteRoute from './routes/noteRoute'
import tabRoute from './routes/tabRoute'
import contentRoute from './routes/contentRoute'
import cors from 'cors'
import mongoose from "mongoose";
import { env } from './inputValidation'


app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send("hello world")
})

app.use('/user',userRoute);
app.use('/note', noteRoute);
app.use('/tab', tabRoute );
app.use('/content', contentRoute);


mongoose.connect(env.DB_STRING)
    .then(() =>{
        console.log("Connected to database");
        app.listen(port, () => console.log('server is listening on port ' + port) );
    })
    .catch((err) => console.log("Error occurred!" , err));

