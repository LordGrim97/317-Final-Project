const {
    Connection,
    Request
} = require("tedious");

// const mysql = require('mysql');

const http = require('http')

const port = process.env.PORT || 3100;

const express = require('express');

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = http.createServer(app)

// var config = {
//     host: '317.database.windows.net',
//     user: 'dcribbs',
//     password: 'Audi1997',
//     database: '317FinalProject',
//     port: 1433,
//     ssl: true,
// }

// pool.getConnection(
//     function(err, conn) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Connection Sucess");
//         }
//     }
// )

const config = {
    authentication: {
        options: {
            userName: "dcribbs",
            password: "Audi1997"
        },
        type: 'default'
    },
    server: "317.database.windows.net",
    options: {
        database: '317FinalProject',
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
        rowCollectionOnDone: true
    }
};

const connection = new Connection(config);
connection.on("connect", err => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connection Successs");
        //queryTest()
    }
})


function queryTest() {
    items = [];

    const request = new Request(
        "SELECT * FROM Recipes",
        (err, rowCount) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(`${rowCount} row(s) returned`);
            }
        }
    );
    
    request.on('row', columns => {
        columns.forEach(column => {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);
    
}   


server.listen(port, () => {
    console.log("Server Started");



    
})


function executeInsert(query, callback) {
    const request = new Request(
        query, 
        (err, rowCount) => {
            if (err) {
                console.log(err);
            } else {
                callback('completed');
                console.log("complete");
            }
        }
    )

    connection.execSql(request);
}

function execute(query, lastCol, callback) {
    var items = [];
    const request = new Request(
        query,
        (err, rowCount) => {
            if (err) {
                console.log(err)
            } else {
                callback(items);
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );
    
    row = {}
    request.on('row', columns => {
        columns.forEach(column => {
            row[column.metadata.colName] = column.value;
            if (row[lastCol] != null) {
                items.push(row);
                row = {}
            }
        });
    });
    
    connection.execSql(request);
}

// app.get("/test", (req, res, next) => {
//     query = "SELECT * FROM Recipes";

//     executeRecipeTable(query, function(items) {
//         res.json(items);
//     });
// })

app.get("/getRecipeNames/:item", (req, res, next) => {
    var item = req.params.item;

    var query = `
        SELECT
            RecipeId,
            RecipeImage,
            RecipeName
        FROM Recipes
        WHERE Ingredients LIKE '%` + item + "%'"; 

    lastCol = "RecipeName";
    //console.log(query);
    execute(query, lastCol, function(items) {
        res.json(items);
    });

})

app.get("/getRecipeDetails/:id", (req, res, next) => {
    var id = req.params.id;

    var query = `
        SELECT 
            *
        FROM Recipes
        WHERE RecipeId = '` + id + "'";

    lastCol = "RecipeName";
    execute(query, lastCol, function(items) {
        res.json(items);
    });
})

app.get('/login/:username/:password', (req, res, next) => {
    
    var username = req.params.username;
    var password = req.params.password;

    var query = `
    SELECT 
        UserId,
        Username
    FROM Users
    WHERE Username = '` + username + "' AND  Pass = '" + password +  "'";

    lastCol = "Username";
    execute(query, lastCol, function(item) {
        res.json(item);
    })
})

app.get("/getUserReviews/:id", (req, res, next) => {
    var id = req.params.id;

    var query = `
    SELECT 
        A.RecipeName AS RecipeName,
        B.ReviewScore AS ReviewScore
    FROM Recipes A JOIN Reviews B
        ON A.RecipeId = B.RecipeId
    WHERE B.UserId = '` + id + "'";

    lastCol = "ReviewScore";
    execute(query, lastCol, function(items) {
        res.json(items);
    });
})

app.get("/getReviews/:id", (req, res, next) => {
    var id = req.params.id;

    var query = `
    SELECT
        B.ReviewScore AS ReviewScore,   
        A.Username AS Username
    FROM Users A JOIN Reviews B
        ON A.UserId = B.UserId
    WHERE B.RecipeId = ` + id + "";

    //console.log(query);
    lastCol = "Username";
    execute(query, lastCol, function(items) {
        res.json(items);
    });
})

app.get("/addReview/:score/:user/:recipe", (req, res, next) => {
    var score = req.params.score;
    var user = req.params.user;
    var recipe = req.params.recipe;

    var query = `
    INSERT INTO Reviews (
        RecipeId,
        ReviewScore,
        UserId
    ) VALUES (` + recipe + ", " + score + ", " + user + ")";


    executeInsert(query, function(response) {
        res.json(response);
    });
})

app.get("/createAccount/:username/:password", (req, res, next) => {
    var username = req.params.username;
    var password = req.params.password;

    var query = `
    INSERT INTO Users (
        Username,
        Pass
    ) VALUES ('` + username + "', '" + password + "')";
    console.log(query);
    executeInsert(query, function(response) {
        res.json(response);
    });
})

