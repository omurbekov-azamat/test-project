import React from 'react';
import ListUsers from "../features/chats/components/ListUsers";
import MessageForm from "../features/messages/MessageForm";
import {Card, Grid} from "@mui/material";

const Chat = () => {
    return (
        <Card>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <ListUsers/>
                </Grid>
                <Grid item xs={8} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                    <MessageForm/>
                </Grid>
            </Grid>
        </Card>
    );
};

export default Chat;
