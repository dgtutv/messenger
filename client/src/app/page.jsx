"use client"

import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:8080"); //Change to actual URL when deploying

function page() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/home").then(
      response => response.json()
    ).then(
      data => {
        setMessageReceived(data.message);
      }
    )
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  }

  return (
    <div>
      <p>{messageReceived}</p>
      <input type="text" placeholder='Room ID' onChange={(event) => {
        setRoom(event.target.value);
      }} />
      <button onClick={joinRoom}>Join</button>
      <input type="text" placeholder='Message...' onChange={(event) => {
        setMessage(event.target.value);
      }} />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}

export default page