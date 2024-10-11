import React from 'react';
import ListUsers from "../features/chats/components/ListUsers";
import MessageForm from "../features/messages/components/MessageForm";
import { Card, Grid } from "@mui/material";
import MessageItems from "../features/messages/components/MessageItems";
import SelectGroup from "../features/groups/components/SelectGroup";

const Chat = () => {
    return (
        <Card>
            <Grid container>
                <Grid item xs={12} sm={4} md={3}   sx={{
                    overflowY: 'auto',
                    maxHeight: { xs: '26vh'},
                    minHeight: { xs: '26vh',   sm: '80vh'},
                }}>
                    <SelectGroup/>
                    <ListUsers />
                </Grid>
                <Grid item xs={12} sm={8} md={9} sx={{height:'100%'}}>
                    <Card sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(135deg, #00C9FF, #92FE9D)',
                        minHeight: { xs: '52vh', sm: '80vh'}
                    }}>
                        <MessageItems />
                        <MessageForm />
                    </Card>
                </Grid>
            </Grid>
        </Card>
    );
};

export default Chat;