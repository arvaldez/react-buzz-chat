import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
import "./Chat.css";

var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "https://react-buzz-chat.herokuapp.com/";
  // const LOCAL = "localhost:5000";
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    //"localhost:5000"

    // socket = io.connect(LOCAL, connectionOptions);
    socket = io.connect(ENDPOINT, connectionOptions);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);
  //function for sending messages

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const sendBuzz = () => {
    socket.emit("sound");
    // socket.on("sound", info);
    socket.emit("sendMessage", "buzz", () => setMessage(""));
  };

  // var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // const sendBuzz = () => {
  //   console.log("send buzz");
  //   socket.emit("sendMessage", "buzz", () => setMessage(""));
  //   socket.on("sound", (sound) => {
  //     console.log("sound");
  //     var source = audioCtx.createBufferSource();
  //     audioCtx.decodeAudioData(sound, function (buf) {
  //       source.buffer = buf;
  //       source.connect(audioCtx.destination);
  //       source.start();
  //     });
  //   }
  // };

  // socket.on("sound", function (info) {
  //   if (info.sound) {
  //     var img = new Audio();
  //     img.src = "data:audio/mp3;base64," + info.buffer;
  //     ctx.drawImage(img, 0, 0);
  //   }
  // });

  //   //   socket.emit("sound");

  // });

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />

        <Messages messages={messages} name={name} />
        <button className="button" onClick={sendBuzz}>
          BUZZ
        </button>
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
