"use client"

import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

let socket;

function Page() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState({
    senderEmail: "",
    message: "",
    timestamp: ""
  });
  const [recipientEmail, setRecipientEmail] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize socket connection with credentials
    socket = io("http://localhost:8080", {
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      setMessageReceived({ senderEmail: data.senderEmail, message: data.message, timestamp: data.timestamp });
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
        const userEmail = data.user.email;
        setEmail(userEmail);
        setName(data.user.name);
        setIsLoading(false);

        // Register user for direct messaging
        if (socket) {
          socket.emit("register_user", userEmail);
        }
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
    if (socket && message && recipientEmail) {
      socket.emit("send_message", {
        message,
        senderEmail: email,
        recipientEmail: recipientEmail,
        timestamp: Date.now()
      });
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
      <p>Your email: {email}</p>

      <div>
        <input
          type="email"
          placeholder='Recipient Email'
          value={recipientEmail}
          onChange={(event) => setRecipientEmail(event.target.value)}
        />
        <button onClick={() => setRecipientEmail(recipientEmail)}>Set Recipient</button>
      </div>

      <div>
        <input
          type="text"
          placeholder='Message...'
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>

      <div>
        <p><b>From: {messageReceived.senderEmail}</b></p>
        <p>{messageReceived.message}</p>
        <p><i>{messageReceived.timestamp ? new Date(messageReceived.timestamp).toLocaleString() : ""}</i></p>
      </div>
    </div>
  )
}

export default Page