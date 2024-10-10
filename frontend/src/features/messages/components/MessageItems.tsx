import React, { useEffect, useMemo, useRef } from 'react';
import { useAppSelector } from "../../../app/hook";
import { selectMessages } from "../messagesSlice";
import { Box } from "@mui/material";
import MessageItem from "./MessageItem";

const MessageItems = () => {
    const messages = useAppSelector(selectMessages);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const renderedMessages = useMemo(() => {
        return messages.map((message) => (
            <div key={message.id}>
                <MessageItem message={message} />
            </div>
        ));
    }, [messages]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Box
            sx={{ padding: 2, maxHeight: '65vh', overflow: 'auto' }}
            ref={messagesContainerRef}
        >
            {renderedMessages}
        </Box>
    );
};

export default MessageItems;