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
const databaseport = process.env.DATABASE_PORT;


const con = mysql.createConnection({
    host: databaseHost,
    user: username,
    password: password,
    database: database
});

con.connect( (err) =>
{
    if (err) {console.log(`Failed to connect to database: ${err}`)}
    else {console.log("Connection successful - public room")};
})

//GET methods
router.get("/GetChatLog", (request, response) => { 
    console.log("Retrieving chat logs from a specific public chat room");
    const { ChatRoomID } = request.body;
    const query = `SELECT Chat_Log FROM public_chatroom_table WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(result[0]);
    });
});

router.get("/GetAdmins", (request, response) => { 
  console.log("Retrieving users from a specific public chat room");
  const { ChatRoomID } = request.body;
  const query = `SELECT DISTINCT UserName 
  FROM public_chatroom_admin_users 
  JOIN admin_table 
  ON public_chatroom_admin_users.User_ID = admin_table.User_ID
  WHERE Chatroom_ID = ${ChatRoomID}`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(result[0]);
  });
});

router.get("/GetAnons", (request, response) => { 
  console.log("Retrieving users from a specific public chat room");
  const { ChatRoomID } = request.body;
  const query = `SELECT Name 
  FROM public_chatroom_anon_users 
  JOIN anonymous_user_table 
  ON public_chatroom_anon_users.User_ID = anonymous_user_table.User_ID
  WHERE Chatroom_ID = ${ChatRoomID}`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(result[0]);
  });
});

// POST method to create a new chat room
router.post("/create", (request, response) => {
    console.log("Creating a new public chat room");
   
    const { HelpDeskUser, ChatRoomName } = request.body;
    const query = `INSERT INTO public_chatroom_table (Chatroom_Name) 
    VALUES ('${ChatRoomName}'); `   
    con.query(query, (error, result) => {
      if (error) throw error;
     
      const query2 =  `INSERT INTO public_chatroom_admin_users (User_ID, Chatroom_ID)
       VALUES ('${HelpDeskUser}', '${result.insertId}' )`;
      con.query(query2, (e1, r1) => {
        if (e1) throw e1;
       // response.send(`user: ${HelpDeskUser} added to chatroom ID: ${result.insertId}`);
      });
      response.send(`Chat room created with ID: ${result.insertId} \nuser: ${HelpDeskUser} added to chatroom ID: ${result.insertId}`);
    });

});

//add one anon user to public chat
router.post("/addAnonUser", (request, response) => {
  console.log("Updating a public chat room");
  const { ChatRoomID, AnonymouUser } = request.body;
  const query = `INSERT public_chatroom_anon_users (Chatroom_ID, User_ID) 
  VALUES('${ChatRoomID}', '${AnonymouUser}' )`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(`Chat room updated with ID: ${ChatRoomID}`);
  });
});

//add one admin user to public chat
router.post("/addAdminUser", (request, response) => {
  console.log("Updating a public chat room");
  const { ChatRoomID, HelpDeskUser } = request.body;
  const query = `INSERT public_chatroom_admin_users (Chatroom_ID, User_ID) 
  VALUES('${ChatRoomID}', '${HelpDeskUser}' )`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(`Chat room updated with ID: ${ChatRoomID}`);
  });
});

// PUT method to update a chat room
router.put("/updateName", (request, response) => {
    console.log("Updating a public chat room");
    const { ChatRoomID, ChatRoomName } = request.body;
    const query = `UPDATE public_chatroom_table 
    SET Chatroom_Name = '${ChatRoomName}' 
    WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room updated with ID: ${ChatRoomID}`);
    });
});

//one log update
router.put("/updateChatLog", (request, response) => {
  console.log("Updating a public chat room");
  const { ChatRoomID, ChatLog } = request.body;
  const query = `UPDATE public_chatroom_table 
  SET Chat_Log = CONCAT(Chat_Log, '${ChatLog}') 
  WHERE Chatroom_ID = ${ChatRoomID}`;
  con.query(query, (error, result) => {
    if (error) throw error;
    response.send(`Chat room updated with ID: ${ChatRoomID}`);
  });
});


// DELETE method to delete a chat room
router.delete("/delete", (request, response) => {
    console.log("Deleting a public chat room");
    const { ChatRoomID } = request.body;
    const query = `DELETE FROM public_chatroom_table WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room deleted with ID: ${ChatRoomID}`);
    });
  });

module.exports = router;