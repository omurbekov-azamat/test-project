import React from 'react';
import {Box, Container, Typography} from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{background: '#292961;', py: 2}}>
            <Container maxWidth='xl'>
                <Typography color='white'>Footer</Typography>
            </Container>
        </Box>
    );
};

export default Footer;