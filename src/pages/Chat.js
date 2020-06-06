import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client =
  localStorage.getItem("username") && localStorage.getItem("username") !== ""
    ? new W3CWebSocket(
        `${process.env.REACT_APP_WSS_APIURL}?token=${localStorage.getItem(
          "username"
        )}`
      )
    : null;

export default function Chat() {
  const [messageList, setMessageList] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const handleChange = (event) => {
    setNewMsg(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      action: "sendMessage",
      token: localStorage.getItem("username"),
      content: newMsg,
    };
    client.send(JSON.stringify(data));
    // console.log("enter");
    setNewMsg("");
  };

  useEffect(() => {
    client.onopen = () => {
      // console.log("Socket is open!");
      const data = { action: "getRecentMessages" };
      client.send(JSON.stringify(data));
    };
    client.onmessage = (message) => {
      const messages = JSON.parse(message.data);
      setMessageList([...messageList, ...messages.messages]);
      // console.log(messages);
    };
  }, [messageList]);

  return (
    <div>
      {messageList.length ? (
        messageList.map((message, index) => (
          <div key={index}>
            <small>{message.username} :</small> {message.content}
          </div>
        ))
      ) : (
        <div>No messages</div>
      )}
      <form
        style={{ position: "fixed", width: "100%", bottom: 0 }}
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Enter text here"
          name="message"
          type="text"
          onChange={handleChange}
          value={newMsg}
        ></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}