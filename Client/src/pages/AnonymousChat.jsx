import React,{useState} from "react";
import io from "socket.io-client";
import "./Chat.css"
import ChatRoom from "./ChatRoom";

const socket = io.connect("http://localhost:3001");

function AnonymousChat(){

    //Values mostly used for checks
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [modal,setModal] = useState(false);
    const [showHelpDesk, setShowHelpDesk] = useState(false);
    const toggleModal = () => {
        setModal(!modal)
    }
    //Determines how the user joins the chat room
    const joinRoom = () => {
      //Check if Username and room code is not empty
      if (username !== "" && room !== "") {
        socket.emit("join_room", room);
        console.log(room)
        //Determines whether it is the help desk or just a chat
        if(room.includes("HelpDesk"))
        {
            console.log("hi");
            setShowHelpDesk(true);
            console.log(showHelpDesk);
            setShowChat(true);
        }else{
            setShowChat(true);
        }
      }
    };
  
    return (
      //renders the page
      <div className="Chat">
        {!showChat ? (
          <div className="chatContainer">
            <h3>Join A Chat</h3>
            <input
              type="text"
              placeholder="Name..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button onClick={joinRoom}>Join A Room</button>

          </div>
        ) : (
            <>
     
                    <ChatRoom socket={socket} username={username} room={room}/>
             
            
            </>
        )}
      </div>
    );
};



export default AnonymousChat;
          