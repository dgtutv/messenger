"use client"

import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

let socket;

function Page() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState({
    user: "",
    message: "",
    timestamp: ""
  });
  const [room, setRoom] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const joinRoom = () => {
    if (room !== "" && socket) {
      socket.emit("join_room", room);
    }
  }

  useEffect(() => {
    // Initialize socket connection with credentials
    socket = io("http://localhost:8080", {
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      setMessageReceived({ user: data.user, message: data.message, timestamp: data.timestamp });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch user data
    fetch("http://localhost:8080/api/user", {
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        return response.json();
      })
      .then(data => {
        setEmail(data.user.email);
        setName(data.user.name);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch user:', error);
        setIsLoading(false);
        // Only redirect on client side
        if (typeof window !== 'undefined') {
          router.push('/sign-in');
        }
      });
  }, [router]);

  const sendMessage = () => {
    if (socket && message && room) {
      socket.emit("send_message", { message, room, user: email, timestamp: Date.now() });
      setMessage(""); // Clear input after sending
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {name}</h2>
      <input
        type="text"
        placeholder='Room ID'
        value={room}
        onChange={(event) => setRoom(event.target.value)}
      />
      <button onClick={joinRoom}>Join</button>
      <input
        type="text"
        placeholder='Message...'
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>

      <p><b>{messageReceived.user}</b></p>
      <p>{messageReceived.message}</p>
      <p><i>{messageReceived.timestamp ? new Date(messageReceived.timestamp).toLocaleString() : ""}</i></p>
    </div>
  )
}

export default Page