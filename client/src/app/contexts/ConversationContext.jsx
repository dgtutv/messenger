"use client"

import React, { createContext, useContext, useState } from 'react';

const ConversationContext = createContext({
    conversations: [],
    setConversations: () => { },
    recipientEmail: '',
    setRecipientEmail: () => { }
});

export const useConversations = () => useContext(ConversationContext);

export const ConversationProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [recipientEmail, setRecipientEmail] = useState('');

    return (
        <ConversationContext.Provider
            value={{
                conversations,
                setConversations,
                recipientEmail,
                setRecipientEmail
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};
