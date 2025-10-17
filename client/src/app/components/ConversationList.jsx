"use client"

import React from 'react';
import { List, ListItemButton, Typography, Box } from '@mui/material';

const ConversationList = ({ conversations, selectedRecipient, onSelectConversation }) => {
    return (
        <List sx={{ padding: 0, width: '100%' }}>
            {conversations.length > 0 ? (
                conversations.map((conversation) => (
                    <ListItemButton
                        onClick={() => onSelectConversation(conversation.recipientEmail)}
                        key={conversation.recipientEmail}
                        selected={selectedRecipient === conversation.recipientEmail}
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
        </List>
    );
};

export default ConversationList;
