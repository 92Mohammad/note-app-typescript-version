import express from 'express'
const app = express();

app.get('/', (req, res) => {
    res.send( {message: "hello check hello"})
})

app.listen(3000, () => console.log("server is running or port " + 3000));