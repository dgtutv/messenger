"use client"

import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { Typography, Box, useMediaQuery, useTheme, Card, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ConversationList from './components/ConversationList';
import { useConversations } from './contexts/ConversationContext';

let socket;

function Page() {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState({
        senderEmail: "",
        message: "",
        timestamp: ""
    });
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const messagesEndRef = useRef(null);
    const [recipientName, setRecipientName] = useState("");
    const { conversations, setConversations, recipientEmail } = useConversations();
    const [images, setImages] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        console.log(recipientEmail)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: recipientEmail })
        })
            .then(res => res.json())
            .then(data => setRecipientName(data.username))
            .catch(err => console.error("Failed to fetch username:", err))
    }, [recipientEmail]);

    useEffect(() => {
        scrollToBottom();
    }, [conversations, recipientEmail]);

    useEffect(() => {
        if (!messageReceived.message) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userID: email })
        })
            .then(res => res.json())
            .then(data => setMessages(data.messages || []))
            .catch(err => console.error('Failed to fetch messages:', err));
    }, [messageReceived, email])

    useEffect(() => {
        // Initialize socket connection with credentials
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
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
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-messages`, {
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
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

    const sendMessage = async () => {
        if (socket && message && recipientEmail) {
            const newMessage = {
                sender_email: email,
                recipient_email: recipientEmail,
                content: message,
                time_sent: new Date().toISOString()
            };

            setMessages(prevMessages => [...prevMessages, newMessage]);

            // Convert images to base64 if any
            const imageData = [];
            if (images.length > 0) {
                for (const file of images) {
                    const base64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });
                    imageData.push({
                        data: base64,
                        name: file.name,
                        type: file.type
                    });
                }
            }

            // Send everything in one socket emit
            socket.emit("send_message", {
                message,
                senderEmail: email,
                recipientEmail: recipientEmail,
                timestamp: Date.now(),
                images: imageData
            });

            setMessage("");
            setImages([]);
        }
    }

    // Show loading state while checking authentication
    if (isLoading) {
        return <div>Loading...</div>;
    }

    //Keyboard on phones?
    //Edit user, user image in convo
    //Upload images, emojis

    return (
        <Box sx={{ display: "flex", width: "100%", height: "calc(99vh - 64px)", borderTop: 1, borderColor: "divider" }} >
            {isMobile ? <></> : (
                <Box sx={{
                    flex: "2",
                    borderRight: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    overflow: "auto"
                }}>
                    <ConversationList />
                </Box>
            )}
            <Box sx={{
                flex: "5",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default"
            }}>
                {recipientEmail ? (
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
                        <Typography variant="h6">Messaging: {recipientName}</Typography>
                        <Typography variant="caption" color="text.secondary">Their email: {recipientEmail}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
                        <Typography variant="h6">Welcome, {name}</Typography>
                        <Typography variant="caption" color="text.secondary">Your email: {email}</Typography>
                    </Box>
                )}

                <Box sx={{
                    flexGrow: 1,
                    p: 2,
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1
                }}>
                    {recipientEmail ? (
                        (() => {
                            const conversation = conversations.find(conv => conv.recipientEmail === recipientEmail);
                            if (!conversation || conversation.messages.length === 0) {
                                return (
                                    <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                                        No messages yet. Start the conversation!
                                    </Typography>
                                );
                            }
                            return conversation.messages.map((message, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: message.sender_email === email ? "flex-end" : "flex-start",
                                        mb: 0.5
                                    }}
                                >
                                    {message.sender_email === email ? (
                                        //Send message bubble
                                        <Box sx={{
                                            bgcolor: "primary.main",
                                            maxWidth: "70%",
                                            px: 2,
                                            py: 1,
                                            borderRadius: "18px",
                                            borderBottomRightRadius: "4px"
                                        }}>
                                            <Typography variant='body1' color="white" sx={{ wordBreak: "break-word" }}>
                                                {message.content}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        // Received message bubble
                                        <Box sx={{
                                            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                                            maxWidth: "70%",
                                            px: 2,
                                            py: 1,
                                            borderRadius: "18px",
                                            borderBottomLeftRadius: "4px"
                                        }}>
                                            <Typography variant='body1' sx={{ wordBreak: "break-word" }}>
                                                {message.content}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            ));
                        })()
                    ) : (
                        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                            Select a conversation to start messaging
                        </Typography>
                    )}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Message input area */}
                <Box sx={{
                    p: 1.5,
                    borderTop: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1
                }}>
                    {/* Image upload button */}
                    <IconButton
                        component="label"
                        sx={{
                            color: 'primary.main',
                            mb: 0.5,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: 'action.hover',
                                transform: 'scale(1.1)',
                                color: 'primary.dark'
                            }
                        }}
                    >
                        <AddPhotoAlternateIcon />
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setImages((prev) => [...prev, ...files]);
                            }}
                        />
                    </IconButton>

                    {/* Message input */}
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                sendMessage();
                            }
                        }}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                bgcolor: 'background.default',
                                py: 0.5,
                                px: 1.5
                            },
                            '& .MuiInputBase-input': {
                                py: 0.75
                            }
                        }}
                    />

                    {/* Send button */}
                    <IconButton
                        onClick={sendMessage}
                        disabled={!message.trim() || !recipientEmail}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 32,
                            height: 32,
                            mb: 0.5,
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                            '&:disabled': {
                                bgcolor: 'action.disabledBackground',
                                color: 'action.disabled'
                            }
                        }}
                    >
                        <SendIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Box>
        </Box >
    )
}

export default Page