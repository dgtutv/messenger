"use client"

import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { Typography, Box, List, ListItemButton, useMediaQuery, useTheme } from '@mui/material';

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
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        //Load all messages
        if (email) { // Only fetch when email is available
            fetch("http://localhost:8080/api/get-messages", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userID: email
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch messages')
                    }
                    return response.json()
                })
                .then(data => {
                    console.log('Fetched messages:', data);
                    setMessages(data.messages || []);
                })
                .catch(error => {
                    console.error('Failed to fetch messages:', error);
                });
        }
    }, [email])

    // Group messages into conversations
    useEffect(() => {
        if (!email || messages.length === 0) {
            console.log('No email or no messages');
            return;
        }

        console.log('Processing messages:', messages);

        // Create a map to track conversations
        const conversationMap = new Map();

        messages.forEach((msg) => {
            // Determine the other person in the conversation
            const otherPerson = msg.sender_email === email ? msg.recipient_email : msg.sender_email;

            if (!conversationMap.has(otherPerson)) {
                conversationMap.set(otherPerson, {
                    recipientEmail: otherPerson,
                    messages: []
                });
            }

            conversationMap.get(otherPerson).messages.push(msg);
        });

        const conversationArray = Array.from(conversationMap.values());
        console.log('Conversations created:', conversationArray);
        setConversations(conversationArray);
    }, [messages, email])

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
        <Box sx={{ display: "flex", width: "100%", height: "calc(100vh - 64px)", borderTop: 1, borderColor: "divider" }} >
            {isMobile ? <></> : (
                <Box sx={{
                    flex: "2",
                    borderRight: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    overflow: "auto"
                }}>
                    <List sx={{ padding: 0 }}>
                        {conversations.map((conversation) => (
                            <ListItemButton onClick={() => {

                            }} key={conversation.recipientEmail} sx={{ borderBottom: 1, borderColor: "divider" }}>
                                {conversation.recipientEmail}
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            )}
            {/* Main chat area - 5 parts */}
            <Box sx={{
                flex: "5",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default"
            }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
                    <Typography variant="h6">Welcome, {name}</Typography>
                    <Typography variant="caption" color="text.secondary">Your email: {email}</Typography>
                </Box>

                <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
                    {/* Messages will go here */}
                </Box>

                <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
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
                </Box>
            </Box>
        </Box>
    )
}

export default Page