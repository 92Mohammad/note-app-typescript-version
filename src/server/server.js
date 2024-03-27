"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express_1 = require("express");
var app = (0, express_1.default)();
var connectDB_1 = require("./connectDB");
var userRoute_1 = require("./routes/userRoute");
var noteRoute_1 = require("./routes/noteRoute");
var cors_1 = require("cors");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', function (req, res) {
    res.send("hello world");
});
app.use('/user', userRoute_1.default);
app.use('/note', noteRoute_1.default);
// app.get('/getAllOpenTab', (req, res) => {
//
//     const sql = 'SELECT note_id, note_title, currentTab FROM notes WHERE isOpenTab = 1';
//     connection.query(sql, (error, results) => {
//         if(error){
//             console.log(error.message);
//             return res.status(500).json({message: "Query failed"})
//         }
//         else {
//             return res.status(200).send(results);
//         }
//     })
// })
//
// app.post('/postNewOpenTab', (req, res) => {
//
//     const noteId = req.body.note_id;
//     // now set the isTabOpen column as true in notes table so that we can identify that which tab is opened
//     const sql = 'UPDATE notes SET isOpenTab = ?  WHERE note_id = ?'
//     connection.query(sql, [true, noteId], (error, results) => {
//         if (error){
//             console.log(error.message);
//             return res.status(500).json({message: "Query failed"})
//         }
//         else {
//             return res.status(200).send({message: "Tab opened successfully"})
//         }
//     })
// })
//
// app.post('/closeOpenTab', (req, res) => {
//     const noteId = req.body.note_id;
//     const sql = 'UPDATE notes SET isOpenTab = ? WHERE note_id = ?'
//     connection.query(sql, [false, noteId], (error, results) => {
//         if (error){
//             console.log(error.message);
//             return res.status(500).json({message: "Query failed"})
//         }
//         else {
//             return res.status(200).send({message: "tab closed successfully"})
//
//         }
// //     })
// // })
//
// app.post('/setCurrentTab', (req, res) => {
//     const noteId = req. body.note_id
//     // make the value of currentTab as true for the given noteId and make rest fo the currentTab column as false
//     const sql1 = 'UPDATE notes SET currentTab = ?'
//     connection.query(sql1, [false], (error) => {
//         if (error){
//             console.log(error.message);
//             return res.status(500).json({message: "Query failed"})
//         }
//         else {
//             // if query does not fail it means that all value in currentTab column has been set to flase or 0
//             // now make a new query to set the value of currentTab which have note_id = noteId as true or 1
//             const sql2 = 'UPDATE notes SET currentTab = ? WHERE note_id = ?'
//             connection.query(sql2, [true, noteId], (error) => {
//                 if (error){
//                     console.log(error.message);
//                     return res.status(500).json({message: "Query failed"})
//                 }
//                 else {
//                     return res.status(200).send({message: "Current tab has been set successfully"})
//                 }
//             })
//         }
//     })
// // })
//
// app.post('/saveContent', (req, res) => {
//     const {noteContent, noteId} = req.body;
//     //note_content
//     const sql = 'UPDATE notes SET note_content = ?  WHERE note_id = ?'
//     connection.query(sql, [noteContent, noteId] , (error, results) => {
//         if (error){
//             console.log(error.message);
//             return res.status(500).json({message: "Query failed"})
//         }
//         else {
//             return res.status(200).send({message: "Content saved successfully"})
//         }
//     })
// })
//
// app.get('/getContent', async (req, res) => {
//     // return the note_content of currentTab(or where currentTab == true)
//     try {
//         const sql = 'SELECT note_content FROM notes WHERE currentTab = ?'
//         connection.query(sql, [true], (error, results) => {
//             if (error) {
//                 console.log(error.message)
//                 return res.status(500).json({ message: "Query failed" })
//             }
//             else {
//                 return res.status(200).send(results[0])
//             }
//         })
//     }
//     catch(error){
//         console.log(error);
//     }
// })
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, connectDB_1.connection)()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
startServer().then(function (r) { return console.log(r); });
