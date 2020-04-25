const {
    Connection,
    Request
} = require("tedious");


const http = require('http')

const port = process.env.PORT || 3100;

const express = require('express');

const app = express()

const server = http.createServer(app)

// const config = {
//     authentication: {
//         options: {
//             userName: "username",
//             password: "password"
//         },
//         type: "default"
//     },
//     server: "your_server.database.windows.net",
//     options: {
//         database: "your_database",
//         encrypt: true
//     }
// };

server.listen(port, () => {
    console.log("Server Started");

    // const connection = new Connection(config);

    // connection.on("connect", err => {
    //     if (err) {
    //         console.error(err.message)
    //     } else {
    //         console.log("Database Connection Succesful")
    //     }
    // })
})


app.get("/test", (req, res, next) => {
    res.json(["Test1", "Test2", "Test3"])
})



