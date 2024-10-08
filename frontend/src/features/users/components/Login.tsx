import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Avatar, Box, Container, Grid, TextField, Typography} from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {LoadingButton} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {login} from "../usersThunks";
import {selectLoginError, selectLoginLoading} from "../usersSlice";
import {LoginMutation} from "../../../types";

const initialState: LoginMutation = {
    email: '',
    password: '',
};

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const error = useAppSelector(selectLoginError);
    const loading = useAppSelector(selectLoginLoading);
    const [formData, setFormData] = useState<LoginMutation>(initialState);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prevState => ({...prevState, [name]: value}));
    };

    const getFieldError = (fieldName: string) => {
        return error?.[fieldName];
    };

    const submitFormHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await dispatch(login({loginMutation: formData, navigate})).unwrap();
        } catch (error) {
            console.error("login failed:", error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{m: 1, bgcolor: 'red'}}>
                    <LockOpenIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label='email'
                                type='email'
                                name='email'
                                autoComplete='new-email'
                                value={formData.email}
                                onChange={handleInputChange}
                                error={Boolean(getFieldError('email'))}
                                helperText={getFieldError('email')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='password'
                                type='password'
                                name='password'
                                autoComplete='password'
                                value={formData.password}
                                onChange={handleInputChange}
                                error={Boolean(getFieldError('password'))}
                                helperText={getFieldError('password')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton
                                type="submit"
                                color="primary"
                                variant="contained"
                                fullWidth
                                sx={{mb: 2}}
                                loading={loading}
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
