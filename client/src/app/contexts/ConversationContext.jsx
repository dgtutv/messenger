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
    const [addConversation, setAddConversation] = useState(false);

    return (
        <ConversationContext.Provider
            value={{
                conversations,
                setConversations,
                recipientEmail,
                setRecipientEmail,
                addConversation,
                setAddConversation
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};
