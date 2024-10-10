import React from 'react';
import {Box, CardMedia, Paper, Typography} from "@mui/material";
import {useAppSelector} from "../../../app/hook";
import {selectUser} from "../../users/usersSlice";
import {apiURL} from "../../../constants";
import {Message} from "../../../types";

interface Props {
    message: Message;
}

const MessageItem: React.FC<Props> = ({message}) => {
    const user = useAppSelector(selectUser)!;

    return (
        <Box
            key={message.id}
            sx={{
                display: 'flex',
                justifyContent: message.sender_id === user.id ? 'flex-end' : 'flex-start',
                marginBottom: 1,
            }}
        >
            <Paper
                sx={{
                    padding: 1,
                    borderRadius: 1,
                    backgroundColor: message.sender_id === user.id ? '#dcf8c6' : '#fff',
                    maxWidth: '70%',
                }}
            >   {message.image ? (
                <CardMedia
                    component="img"
                    height="200"
                    image={apiURL + '/' + message.image}
                    alt={message.text || 'Attached'}
                />) : null}
                {message.text && (
                    <Typography variant="body1">{message.text}</Typography>
                )}
                <Typography variant="caption" sx={{textAlign: 'right', color: 'grey', fontWeight: '300'}}>
                    {message.created_at}
                </Typography>
            </Paper>
        </Box>
    );
};

export default MessageItem;