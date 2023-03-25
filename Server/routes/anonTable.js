const express = require("express");
const parser = require('body-parser');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();
const verify = require('./../verification.js');
const jwt = require("jsonwebtoken");

router.use(parser.json());
router.use(parser.urlencoded({extended: true}));

const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;
const databaseHost = process.env.DATABASE_HOST;

const con = mysql.createConnection({
    host: databaseHost,
    user: username,
    password: password,
    database: database
});

con.connect( (err) =>
{
    if (err) {console.log(`Failed to connect to database: ${err}`)}
    else {console.log("DB Connection successful")};
})

//get list of all users
router.get("", verify.verifyToken, (request, response) => { 
    
    con.query(`SELECT * FROM anonymous_user_table`, function (err, result, fields) {
        if (err) (response.status(400).send("There is an error in the SQL query, please enter valid entry"));
        else
            {
                console.log(JSON.stringify(result));
                response.send(result)
            }
        });
});

//create new user in database(reading db length is hard so length of each table is stored in tableSizes.json for now, remember to increment the values whenever you add someone)
router.post("", (request, response) =>
{
        let input = request.body;
        con.query(`SELECT COUNT(*) as numRows FROM anonymous_user_table`, (err, result) =>
        {
            let name = input.username;
            let sqlQuery = `INSERT INTO anonymous_user_table (User_ID, Name) VALUES (?, ?)`;
            con.query(sqlQuery, [result[0].numRows + 1, name], function (err, result) {
                if (err) {
                    response.status(400).send("There is an error in the SQL query, please enter valid entry");
                }
                else 
                {
                    console.log(`name:${name}, record inserted`);
                    let token = jwt.sign({name}, process.env.COOKIE_KEY, {
                        expiresIn: "1h",
                    });
                    response.status(200).json(token);
                    return
                };
            });
            
    });
});

module.exports = router;