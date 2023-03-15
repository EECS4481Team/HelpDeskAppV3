const express = require("express");
const parser = require('body-parser');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
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
    else {console.log("Connection successful")};
})

router.get("/getAnonUser", (request, response) => { 
    console.log("Retrieving a specific private chat room");
    const { id } = request.body;
    const query = `SELECT Anonymous_User FROM private_chatroom_table WHERE Chatroom_ID = ${id}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(result);
    });
});

router.get("/getAdminUser", (request, response) => { 
  console.log("Retrieving a specific private chat room");
  const { id } = request.body;
  const query = `SELECT Helpdesk_User FROM private_chatroom_table WHERE Chatroom_ID = ${id}`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(result);
  });
});

//get all empty
router.get("/getPrivateRooms", (request, response) => { 
  console.log("Retrieving empty private chat rooms");
 
  const query = `SELECT Chatroom_ID FROM private_chatroom_table WHERE  Anonymous_User IS NULL`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(result);
  });
});



// POST method to create a new chat room
router.post("/create", (request, response) => {
    console.log("Creating a new private chat room");
    const { HelpDeskUser} = request.body;
    const query = `INSERT INTO private_chatroom_table (Helpdesk_User) 
    VALUES ('${HelpDeskUser}')`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room created with ID: ${result.insertId}`);
    });
});

// PUT method to update a chat room
router.put("/updateChatLog", (request, response) => {
    console.log("Updating a private chat room");
    const { ChatRoomID, ChatLog } = request.body;
    const query = `UPDATE private_chatroom_table 
    SET Chat_Log = CONCAT(Chat_Log, '${ChatLog}') 
    WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room updated with ID: ${ChatRoomID}`);
    });
});

router.put("/updateAdmin", (request, response) => {
  console.log("Updating a private chat room");
  const { ChatRoomID, HelpDeskUser } = request.body;
  const query = `UPDATE private_chatroom_table 
  SET Helpdesk_User = '${HelpDeskUser}'
  WHERE Chatroom_ID = ${ChatRoomID}`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(`Chat room updated with ID: ${ChatRoomID}`);
  });
});

// DELETE method to delete a chat room
router.delete("/", (request, response) => {
    console.log("Deleting a private chat room");
    const { ChatRoomID } = request.body;
    const query = `DELETE FROM private_chatroom_table WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room deleted with ID: ${ChatRoomID}`);
    });
});


module.exports = router;