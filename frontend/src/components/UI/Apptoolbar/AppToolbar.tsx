import React from 'react';
import {useSelector} from "react-redux";
import {selectUser} from "../../../features/users/usersSlice";
import {AppBar, Container, Grid, Toolbar, Typography} from "@mui/material";
import {Link} from '../../../helpers';
import AnonymousMenu from "./AnonymousMenu";
import UserMenu from "./UserMenu";

const AppToolbar = () => {
    const user = useSelector(selectUser);

    return (
        <AppBar position="sticky" sx={{background: '#292961;', py: 2}}>
            <Container maxWidth='xl'>
                <Toolbar>
                    <Grid container justifyContent='space-between' alignItems="center">
                        <Typography variant="h6" component="div">
                            <Link to='/'>Chat</Link>
                        </Typography>
                        <Grid item>
                            {user ? (
                                <UserMenu user={user}/>
                            ) : (
                                <AnonymousMenu/>
                            )}
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppToolbar;