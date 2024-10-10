import React, {useEffect, useMemo, useRef} from 'react';
import {useAppSelector} from "../../../app/hook";
import {selectMessages} from "../messagesSlice";
import {Box} from "@mui/material";
import MessageItem from "./MessageItem";

const MessageItems = () => {
    const messages = useAppSelector(selectMessages);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const renderedMessages = useMemo(() => {
        return messages.map((message) => (
            <div key={message.id}>
                <MessageItem message={message}/>
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
            sx={{
                padding: 2, overflow: 'auto',
                maxHeight: {xs: '25vh'},
                minHeight: {xs: '27vh', sm: '55vh', md: '60vh', lg: '70vh'},
            }}
            ref={messagesContainerRef}
        >
            {renderedMessages}
        </Box>
    );
};

export default MessageItems;