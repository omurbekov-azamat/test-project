import React, { useState } from 'react';
import { Avatar, Box, Container, Grid, TextField, Typography } from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { LoadingButton } from "@mui/lab";
import { LoginMutation } from "../../../types";

const initialState: LoginMutation = {
    email: '',
    password: '',
};

const Login = () => {
    const [formData, setFormData] = useState<LoginMutation>(initialState);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const submitFormHandler = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(formData);
        setFormData(initialState);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{ m: 1, bgcolor: 'red' }}>
                    <LockOpenIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {[
                            { label: 'Email', name: 'email', type: 'email', value: formData.email },
                            { label: 'Password', name: 'password', type: 'password', value: formData.password },
                        ].map((field, index) => (
                            <Grid item xs={12} key={index}>
                                <TextField
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    variant="standard"
                                    autoComplete={`current-${field.name}`}
                                    value={field.value}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <LoadingButton
                                type="submit"
                                color="primary"
                                variant="contained"
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Sign in
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
