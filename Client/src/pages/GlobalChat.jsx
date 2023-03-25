import React,{useEffect, useState} from "react";
import io from "socket.io-client";
import "./Chat.css"
import GlobalChatRoom from "./GlobalChatRoom";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { anonymousRoute } from "../utils/APIRoutes";
import {ToastContainer, toast} from "react-toastify";

const socket = io.connect("http://localhost:3001");

const toastOptions = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover:true,
  draggable: true,
  theme: "dark",
  }

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

    const sessionEstablish = async (username)=>{
      
      const {data} = await axios.post(anonymousRoute,{
          username
      }).catch(function (error){
          if(error.response){
              toast.error("Session Failed!", toastOptions);
              
          }
      });
      if(data.status === undefined){
          console.log(data);
          localStorage.setItem(`anoncookie`, JSON.stringify(data));
          }
    };

    const getNameFromCookie = () =>
    {
        //Get the "data" from localStorage using key `HelpDeskAppV1`
        var str = localStorage.getItem(`anoncookie`);
        //Gives a string in base64, only need info between 2 periods
        var subStr = str.substring(
          str.indexOf('.') + 1, 
          str.lastIndexOf('.')
        );
        //Decode from base64
        var dec = atob(subStr);
        //Get substring between second instance of ':' and first instance of ','

        var newStr = dec.substring( 
          dec.indexOf(':"', 1) + 2, 
          dec.indexOf('",')
        );
        //Check string
        // console.log(newStr);
        return newStr;
    }

    const joinRoom = () => {
      if (localStorage.getItem(`anoncookie`) != null) {
        setUsername(getNameFromCookie());
      }

      else if (username !== "" && localStorage.getItem(`anoncookie`) == null) {
        sessionEstablish(username)
      }
      
      if (username !== "" && room !== "") {
        setUsername(username);
        sessionEstablish(username);
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
              placeholder={localStorage.getItem(`anoncookie`) != null ? getNameFromCookie() : "Name..."}
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