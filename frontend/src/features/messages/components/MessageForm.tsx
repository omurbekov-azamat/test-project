import React, {useEffect, useState} from 'react';
import {Params, useParams} from "react-router-dom";
import FileInput from "../../../components/FileInput/FileInput";
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {getMessages, sendMessage} from "../messagesThunks";
import {selectSendMessageLoading} from "../messagesSlice";
import {ArrowCircleUpSharp} from "@mui/icons-material";
import {Box, Grid, TextField} from "@mui/material";
import {selectUser} from "../../users/usersSlice";
import {LoadingButton} from "@mui/lab";
import {getGroupMessages} from "../../groups/groupsThunks";
import {MessageMutation} from "../../../types";

const MessageForm = () => {
    const dispatch = useAppDispatch();
    const {id, groupId}: Params = useParams();
    const user = useAppSelector(selectUser)!;
    const loading = useAppSelector(selectSendMessageLoading);

    const initialMessageState: MessageMutation = {
        receiver_id: id || null,
        text: '',
        image: null,
        chat_group_id: groupId || null,
    };

    const [message, setMessage] = useState<MessageMutation>(initialMessageState);

    useEffect(() => {
        setMessage(prev => ({
            ...prev,
            receiver_id: id || null,
            chat_group_id: groupId || null,
        }));
    }, [id, groupId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setMessage(prev => ({...prev, [name]: value}));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        const file = files ? files[0] : null;
        setMessage(prev => ({...prev, [name]: file}));
    };

    const resetMessage = () => {
        setMessage(initialMessageState);
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (id || groupId) {
            await dispatch(sendMessage({message, token: user.token}));

            if (id) {
                await dispatch(getMessages({id, token: user.token}));
                resetMessage();
            }

            if (groupId) {
                dispatch(getGroupMessages({id: groupId, token: user.token}));
                resetMessage();
            }
        }
    };

    return (id || groupId) ? (
        <Box sx={{p: 1}}>
            <form onSubmit={submitForm}>
                <Grid container direction='row' spacing={2} alignItems="center">
                    <Grid item xs={12} sm={12} md={12} lg={5}>
                        <TextField
                            label='Message'
                            name='text'
                            value={message.text}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={5}>
                        <FileInput
                            label="Image"
                            name="image"
                            onChange={handleFileChange}
                            type="images/*"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={2}>
                        <LoadingButton
                            type='submit'
                            color='secondary'
                            loadingPosition='start'
                            variant='contained'
                            startIcon={<ArrowCircleUpSharp/>}
                            fullWidth
                            loading={loading}
                        >
                            Send
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
        </Box>
    ) : null;
};

export default MessageForm;