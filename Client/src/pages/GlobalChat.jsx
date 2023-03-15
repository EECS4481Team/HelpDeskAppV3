import React,{useEffect, useState} from "react";
import io from "socket.io-client";
import "./Chat.css"
import GlobalChatRoom from "./GlobalChatRoom";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const socket = io.connect("http://localhost:3001");

function GlobalChat(){

    //Values mostly used for checks
    const [username, setUsername] = useState("");
    const room = useState("Public");
    const [showChat, setShowChat] = useState(false);
    const [modal,setModal] = useState(false);
    const navigate = useNavigate();
    const[posts,setPosts] =useState([])
    useEffect(()=> {
      axios.get()
    })
    const toggleModal = () => {
        setModal(!modal)
    }
    //Determines how the user joins the chat room
    const joinRoom = () => {
      if (username !== "" && room !== "") {
        socket.emit("join_room", room);
        console.log(room)
        setShowChat(true);
      }
    };
    //Direct to different pages from the buttons
    const movePrivate = () => {
      navigate("/chat/anon")
    }
    const moveAdmin = () => {
      navigate("/login")
    }
    const moveRegister = () => {
      navigate("/register")
    }

    return (
      //render the page
      <div className="Chat">
        {!showChat ? (
          <div className="chatContainer">
            <h3>Anonymous Chat</h3>
            <input
              type="text"
              placeholder="Name..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <button onClick={joinRoom}>Join A Global Chat</button>
            <button onClick={movePrivate}>Private Chat</button>
            <button onClick={moveRegister}>Register as Admin</button> 
            <button onClick={moveAdmin}>Login as Admin</button>
          </div>
        ) : (
            <>
                <GlobalChatRoom socket={socket} username={username} room={room}/>
                        <h2>Contact with Super Admin with This RoomID</h2>
                        <h3> If there is an error...</h3>
                        <p> RoomID: <b>HelpDesk</b></p>

            </>
        )}
      </div>
    );
};



export default GlobalChat;