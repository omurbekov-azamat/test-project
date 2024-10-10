import React from 'react';
import ListUsers from "../features/chats/components/ListUsers";
import MessageForm from "../features/messages/components/MessageForm";
import {Box, Card, CardContent, Grid} from "@mui/material";
import MessageItems from "../features/messages/components/MessageItems";

const Chat = () => {
    return (
        <Card sx={{height: "80vh", p: 2}}>
            <Grid container>
                <Grid item xs={4}>
                    <ListUsers/>
                </Grid>
                <Grid item xs={8}>
                    <Card sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '76vh',
                        justifyContent: 'space-between',
                        background: 'rgba(0, 0, 0, 0.04)',
                    }}>
                        <MessageItems/>
                        <MessageForm/>
                    </Card>
                </Grid>
            </Grid>
        </Card>
    );
};

export default Chat;
