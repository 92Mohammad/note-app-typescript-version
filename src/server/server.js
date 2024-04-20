"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express_1 = require("express");
var app = (0, express_1.default)();
var port = process.env.PORT;
var userRoute_1 = require("./routes/userRoute");
var noteRoute_1 = require("./routes/noteRoute");
var tabRoute_1 = require("./routes/tabRoute");
var contentRoute_1 = require("./routes/contentRoute");
var cors_1 = require("cors");
var mongoose_1 = require("mongoose");
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.get('/', function (req, res) {
    res.send("hello world");
});
app.use('/user', userRoute_1.default);
app.use('/note', noteRoute_1.default);
app.use('/tab', tabRoute_1.default);
app.use('/content', contentRoute_1.default);
mongoose_1.default.connect(process.env.DB_STRING)
    .then(function () {
    console.log("Connected to database");
    app.listen(port, function () { return console.log('server is listening on port ' + port); });
})
    .catch(function (err) { return console.log("Error occurred!", err); });
