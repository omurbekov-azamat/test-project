import React from 'react';
import {Box, Container, CssBaseline} from "@mui/material";
import AppToolbar from "../components/UI/Apptoolbar/AppToolbar";
import {Outlet} from "react-router-dom";
import Footer from "../components/UI/Footer/Footer";

const Home = () => {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <header>
                <CssBaseline/>
                <AppToolbar/>
            </header>
            <Container maxWidth="xl" component="main" sx={{flex: 1, m: "auto"}}>
                <Outlet/>
            </Container>
            <footer style={{flexShrink: 0}}>
                <Footer/>
            </footer>
        </Box>
    );
};

export default Home;