require("dotenv").config()
import express from 'express'
const app = express()
const port = process.env.PORT
import userRoute from "./routes/userRoute";
import noteRoute from './routes/noteRoute'
import tabRoute from './routes/tabRoute'
import contentRoute from "./routes/contentRoute";
import cors from 'cors'
import mongoose from "mongoose";


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));


app.get('/', (req, res) => {
    res.send("hello world")
})

app.use('/user',userRoute);
app.use('/note', noteRoute);
app.use('/tab', tabRoute );
app.use('/content', contentRoute);


mongoose.connect(process.env.DB_STRING!)
    .then(() =>{
        console.log("Connected to database");
        app.listen(port, () => console.log('server is listening on port ' + port) );
    })
    .catch((err) => console.log("Error occurred!" , err));

