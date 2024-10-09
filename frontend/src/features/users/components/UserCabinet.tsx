import React from 'react';
import {Box, Card, CardContent, Grid} from "@mui/material";
import ChangePassword from "../../../components/UI/ChangePassword/ChangePassword";

const UserCabinet = () => {
    return (
        <Box mt={3}>
            <Card sx={{ minHeight: '600px' }}>
                <CardContent>
                    <ChangePassword/>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserCabinet;