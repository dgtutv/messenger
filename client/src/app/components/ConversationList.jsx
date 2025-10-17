"use client"

import React, { useState } from 'react';
import { List, ListItemButton, Typography, Box, ListItem, TextField, Button } from '@mui/material';
import { useConversations } from '../contexts/ConversationContext';

const ConversationList = ({ onSelectCallback, senderEmail }) => {
    const { conversations, setConversations, recipientEmail, setRecipientEmail, addConversation, setAddConversation } = useConversations();
    const [newEmail, setNewEmail] = useState("");

    const handleNewConversation = () => {
        //If no input, no work, if exists, redirect page no work
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (newEmail === "" || !emailRegex.test(newEmail)) {
            return;
        }
        // Check if conversation already exists
        if (conversations.some(conv => conv.recipientEmail === newEmail)) {
            // If exists, just switch to it
            setAddConversation(false);
            setRecipientEmail(newEmail);
            setNewEmail("");
            if (onSelectCallback) onSelectCallback();
            return;
        }
        // Create a new conversation with proper immutability
        setConversations(prev => [...prev, { recipientEmail: newEmail, messages: [] }]);
        setAddConversation(false);
        setRecipientEmail(newEmail);
        setNewEmail("");
        if (onSelectCallback) onSelectCallback();
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleNewConversation();
        }
    };

    return (
        <List sx={{ padding: 0, width: '100%' }}>
            {conversations.length > 0 ? (
                conversations.map((conversation) => (
                    <ListItemButton
                        onClick={() => {
                            setRecipientEmail(conversation.recipientEmail);
                            if (onSelectCallback) onSelectCallback();
                        }}
                        key={conversation.recipientEmail}
                        selected={recipientEmail === conversation.recipientEmail}
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            '&.Mui-selected': {
                                bgcolor: 'action.selected'
                            }
                        }}
                    >
                        <Box sx={{ width: '100%', overflow: 'hidden' }}>
                            <Typography variant="body1" fontWeight="500" noWrap>
                                {conversation.recipientEmail}
                            </Typography>
                            {conversation.messages.length > 0 && (
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {conversation.messages[conversation.messages.length - 1].content}
                                </Typography>
                            )}
                        </Box>
                    </ListItemButton>
                ))

            ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        No conversations yet
                    </Typography>
                </Box>
            )}
            {addConversation ? (
                <ListItem sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    '&.Mui-selected': {
                        bgcolor: 'action.selected'
                    }
                }}>
                    <Box sx={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: "column", alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                            <TextField
                                variant="standard"
                                label="Email"
                                value={newEmail}
                                onKeyDown={handleKeyDown}
                                fullWidth
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <Button
                                onClick={handleNewConversation}
                                variant='outlined'
                            >
                                Add
                            </Button>
                        </Box>

                        <Typography variant="caption" color="text.secondary" noWrap>
                            New conversation...
                        </Typography>
                    </Box>
                </ListItem>
            ) : (
                <></>
            )
            }

        </List >
    );
};

export default ConversationList;
