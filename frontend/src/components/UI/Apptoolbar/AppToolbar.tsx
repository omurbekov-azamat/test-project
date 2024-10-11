import React from 'react';
import {useSelector} from "react-redux";
import {selectUser} from "../../../features/users/usersSlice";
import {AppBar, Box, Button, Container, Grid, Toolbar, Typography} from "@mui/material";
import {Link} from '../../../helpers';
import AnonymousMenu from "./AnonymousMenu";
import UserMenu from "./UserMenu";
import {useAppDispatch} from "../../../app/hook";
import {clearMessages} from "../../../features/messages/messagesSlice";
import AddChat from "../AddChat/AddChat";
import CreateGroup from "../../../features/groups/components/CreateGroup";
import {useParams} from "react-router-dom";
import GroupMembers from "../../../features/groups/components/GroupMembers";

const AppToolbar = () => {
    const dispatch = useAppDispatch();
    const {groupId} = useParams();
    const user = useSelector(selectUser);

    return (
        <AppBar position="sticky" sx={{background: '#292961;', py: 2, mb: 1}}>
            <Container maxWidth='xl'>
                <Toolbar>
                    <Grid container alignItems='center' justifyContent='space-between'>
                        <Grid item xs={12} sm={2}>
                            <Typography variant="h6" component="div">
                                <Link to='/' onClick={() => dispatch(clearMessages())}>Chat</Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            {user ? (
                                <Grid container justifyContent='space-between' alignItems='center'>
                                    <Grid item>
                                        <Grid container alignItems={'center'}>
                                            <Grid mr={1}>
                                                <AddChat/>
                                            </Grid>
                                            <Grid mr={1}>
                                                <CreateGroup/>
                                            </Grid>
                                            {groupId ? (
                                                <Grid>
                                                    <GroupMembers id={groupId}/>
                                                </Grid>
                                            ) : null}
                                        </Grid>
                                    </Grid>
                                    <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <UserMenu user={user}/>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container justifyContent="flex-end">
                                    <AnonymousMenu />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppToolbar;