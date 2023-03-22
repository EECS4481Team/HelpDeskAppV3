import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";

function GlobalChatRoom({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // refresh function to go back
  function refreshPage() {
    window.location.reload(false);
  }

  // create sent messages
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // upload file function
  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    // send the file to the server
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      });
  }

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      console.log(data);
    })
  }, [socket]);

  return (
    //Render messages
    <div className="chat-window">
      <div className="chat-header">
        <p>Global Chat Feel Free to Talk Each Other</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div className='message' id={username === messageContent.author ? "you" : "other"}>
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <input type="file" onChange={handleFileInputChange} />
        <button onClick={uploadFile}>&#9981;</button>
        <button onClick={sendMessage}>&#9658;</button>

      </div>
      <div>
        <button onClick={refreshPage}>Click to refresh & return to previous page</button>
      </div>
    </div>

  )
}

export default GlobalChatRoom
