const express = require("express");
const parser = require('body-parser');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const verify = require('./../verification.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
require('dotenv').config();

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


//get ID
router.get("/username", verify.verifyToken, (request, response) => { 
    console.log(request.query);

    let sqlQuery = `SELECT User_ID FROM admin_table WHERE UserName = ?`;
    con.query(sqlQuery,[request.query.userName], function (err, result, fields) { 
        if (err) (response.status(400).send("There is an error in the SQL query, please enter valid entry"))
        else response.send(result);
    })
});

//get email
router.get("/email", verify.verifyToken, (request, response) => { 

    let sqlQuery = `SELECT Email FROM admin_table WHERE UserName = ?`;
    con.query(sqlQuery, [request.query.userName], function (err, result, fields) { 
        if (err) (response.status(400).send("There is an error in the SQL query, please enter valid entry"))
        else response.send(result);
    })
});

//post new admin
router.post("/register", (request, response) =>
{
    let input = request.body;
    if( !input.userName || !input.password || !input.email)
    {
        response.status(400).send("All fields must be filled")
        return
    }
    else(
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) {console.log("Salting error")
            response.status(500).send("Salting error")
            return};

            bcrypt.hash(input.password, salt, function(err, hash) {
                if (err) {console.log("Hashing error")
                response.status(500).send("Hashing error")
                return};
                con.query(`SELECT COUNT(*) as numRows FROM admin_table`, (err, result) =>
                {
                    let sqlQuery = `INSERT INTO admin_table (User_ID, UserName, PasswordHash, Email) VALUES (?, ?, ?, ? )`;
                    con.query(sqlQuery, [result[0].numRows + 1, input.userName, hash, input.email], function (err, result) {
                        if (err) 
                        {
                            console.log("An admin with this name already exists");
                            response.status(400).send("An admin with this name already exists")
                            return
                        }
        
                        else console.log("1 Admin inserted");
                            response.sendStatus(200);
                        })
                    })
                })
            })
        )
        
});

//login
router.post("/login", async (request,response) =>
{
    let user = request.body;
    let sqlQuery = `SELECT UserName, PasswordHash FROM admin_table WHERE username = ?`

    con.query(sqlQuery, [user.username], async function (err, result) {
        if (err) (response.status(400).send("There is an error in the SQL query, please enter valid entry"))
        else  
            {
            if( JSON.stringify(result) == "[]" )
            {
                response.status(400).send("no such user exists")
                console.log("NSU exist")
                return
            }
            
            let validPassword = await bcrypt.compare(user.password, result[0].PasswordHash )
            if( !validPassword )
            {
                response.status(400).send("Incorrect Password")
                console.log("bad password")
                return
            }
            else
            {
                let token = jwt.sign({user}, process.env.JWT_KEY, {
                    expiresIn: "1h",
                });
                response.status(200).json(token);
                return
            }
        }
    })
})

//put password hash
router.put("/newPassword", verify.verifyUserIdentity, (request, response) =>
{
    let input = request.body;
    
    if(verifyUserIdentity(request, response))
    {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) (response.status(400).send("There has been an error in salting. Please contact an administrator."))
        else 
        {
            bcrypt.hash(input.newPass, salt, function(err, hash) {
                if (err) console.log(err);
                console.log(hash)

                    let sqlQuery = `UPDATE admin_table SET name = ? WHERE UserName = ?`;
                    con.query(sqlQuery,[hash, input.userName], function (err, result) {
                        if (err) (response.status(400).send("There is an error in the SQL query, please enter valid entry"));
                        else console.log("admin password updated");
                    });
            });
        }
     });
    response.sendStatus(200);
    }
});

//put email
router.put("/newEmail", verify.verifyUserIdentity, (request, response) =>
{
    let input = request.body;
    let sqlQuery = `UPDATE admin_table SET name = ? WHERE UserName = ?`;

    if(verifyUserIdentity(request, response))
    {
        con.query(sqlQuery,[input.newMail, input.userName], function (err, result) {
            if (err) (response.status(400).send("There is an error in the SQL query, please enter valid entry"))
            else { console.log("Admin Email update"); response.sendStatus(200); }
        });
        
    }
});

//delete user
router.delete("/Delete", verify.verifyUserIdentity, (request, response) =>
{
    let input = request.body;
    let sqlQuery = `DELETE FROM admin_table WHERE UserName = ?`
    if(verifyUserIdentity(request, response))
    {
        con.query(sqlQuery, [input.userName], function (err, result) {
            if (err) (response.status(400).send("There is an error in the SQL query, please enter valid entry"))
            else { console.log("Number of records deleted: " + result.affectedRows);  response.sendStatus(200);}
        });
       
    }
});

module.exports = router;