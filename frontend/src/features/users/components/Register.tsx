import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {register} from "../usersThunks";
import {useAppDispatch} from "../../../app/hook";
import {Avatar, Box, Container, Grid, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FileInput from "../../../components/FileInput/FileInput";
import {LoadingButton} from "@mui/lab";
import {RegisterMutation} from "../../../types";

const initialFormState: RegisterMutation = {
    email: '',
    password: '',
    username: '',
    image: null,
};

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
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
                alignItems: 'center',
            }}>
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component='form' sx={{mt: 3}} onSubmit={submitFormHandler}>
                    <Grid container spacing={2}>
                        {[
                            {label: 'Email', type: 'email', name: 'email', value: formData.email},
                            {label: 'Username', type: 'text', name: 'username', value: formData.username},
                            {label: 'Password', type: 'password', name: 'password', value: formData.password},
                        ].map((field, index) => (
                            <Grid item xs={12} key={index}>
                                <TextField
                                    label={field.label}
                                    type={field.type}
                                    name={field.name}
                                    value={field.value}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <FileInput
                                label="Avatar"
                                name="image"
                                onChange={fileInputChangeHandler}
                                type="images/*"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton
                                type="submit"
                                color="secondary"
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
