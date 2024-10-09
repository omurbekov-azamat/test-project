import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import FileInput from "../../components/FileInput/FileInput";
import {ArrowCircleUpSharp} from "@mui/icons-material";
import {Box, Grid, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {MessageMutation} from "../../types";

const MessageForm = () => {
    const {id} = useParams() as { id: string };
    const [message, setMessage] = useState<MessageMutation>({
        receiver_id: id,
        text: '',
        image: null,
    });

    useEffect(() => {
        setMessage(prev => ({...prev, receiver_id: id}));
    }, [id]);

    const inputChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setMessage(prev => ({...prev, [name]: value}));
    };

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        const file = files && files[0] ? files[0] : null;
        setMessage(prev => ({...prev, [name]: file}));
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            console.log(message);
            setMessage({receiver_id: id, text: '', image: null});
        }
    };

    return (
        id ? (
            <Box sx={{p: 3}}>
                <form onSubmit={submitForm}>
                    <Grid container direction='row' spacing={2} alignItems="center">
                        <Grid item xs>
                            <TextField
                                label='text'
                                type='text-area'
                                name='text'
                                value={message.text}
                                onChange={inputChangeMessage}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs>
                            <FileInput
                                label="image"
                                name="image"
                                onChange={fileInputChangeHandler}
                                type="images/*"
                            />
                        </Grid>
                        <Grid item xs>
                            <LoadingButton
                                type='submit'
                                color='secondary'
                                loadingPosition='start'
                                variant='contained'
                                startIcon={<ArrowCircleUpSharp/>}
                                fullWidth
                            >
                                Send
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>) : null
    );
};

export default MessageForm;