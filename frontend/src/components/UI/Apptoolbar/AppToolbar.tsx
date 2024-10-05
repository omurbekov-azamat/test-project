import React from 'react';
import {AppBar, Container, Grid, Toolbar, Typography} from "@mui/material";

const AppToolbar = () => {
    return (
        <AppBar position="sticky" sx={{background: '#292961;', py: 2}}>
            <Container maxWidth='xl'>
                <Toolbar>
                    <Grid container justifyContent='space-between' alignItems="center">
                        <Typography variant="h6" component="div">
                            Chat
                        </Typography>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppToolbar;