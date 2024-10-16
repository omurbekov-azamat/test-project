import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {register} from "../usersThunks";
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {Avatar, Box, Container, Grid, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FileInput from "../../../components/FileInput/FileInput";
import {LoadingButton} from "@mui/lab";
import {RegisterMutation} from "../../../types";
import {selectRegisterError, selectRegisterLoading} from "../usersSlice";

const initialFormState: RegisterMutation = {
    email: '',
    password: '',
    username: '',
    image: null,
};

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const error = useAppSelector(selectRegisterError);
    const loading = useAppSelector(selectRegisterLoading);

    const [formData, setFormData] = useState<RegisterMutation>(initialFormState);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        const file = files && files[0] ? files[0] : null;
        setFormData(prev => ({...prev, [name]: file}));
    };

    const getFieldError = (fieldName: string) => {
        return error?.[fieldName];
    };

    const submitFormHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await dispatch(register(formData)).unwrap();
            navigate('/');
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <Container component='main' maxWidth='xs'>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component='form' sx={{mt: 3, maxWidth: '300px'}} onSubmit={submitFormHandler}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
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
                                fullWidth
                                label='username'
                                type='username'
                                name='username'
                                autoComplete='new-username'
                                value={formData.username}
                                onChange={handleInputChange}
                                error={Boolean(getFieldError('username'))}
                                helperText={getFieldError('username')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
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
                            <FileInput
                                label="avatar"
                                name="image"
                                onChange={fileInputChangeHandler}
                                type="images/*"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton
                                type="submit"
                                color="secondary"
                                loading={loading}
                                variant="contained"
                                fullWidth
                                sx={{mb: 2}}
                            >
                                Sign Up
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
