import React, {useEffect, useMemo, useRef} from 'react';
import {useAppSelector} from "../../../app/hook";
import {selectMessages} from "../messagesSlice";
import {Box} from "@mui/material";
import MessageItem from "./MessageItem";
import { v4 as uuidv4 } from 'uuid';

const MessageItems = () => {
    const messages = useAppSelector(selectMessages);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const renderedMessages = useMemo(() => {
        return messages.map((message) => (
            <MessageItem key={uuidv4()} message={message}/>
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