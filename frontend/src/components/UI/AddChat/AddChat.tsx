import React, {useState} from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import {Box} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {addUser, getUsers} from "../../../features/users/usersThunks";
import {selectUser} from "../../../features/users/usersSlice";

const AddChat = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser)!;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setUsername(value);
    };

    const handleConfirmAdd = async () => {
        await dispatch(addUser({username, token: user.token}))
        await dispatch(getUsers(user.token));
        setUsername('');
        setOpen(false);
    };

    return (
        <Box textAlign={'center'}>
            <Button variant="outlined" onClick={handleClickOpen} fullWidth>Add user</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add user</DialogTitle>
                <DialogContent>
                    <TextField
                        label='username'
                        type='username-area'
                        name='username'
                        value={username}
                        onChange={inputChangeHandler}
                        required
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>cancel</Button>
                    <Button onClick={handleConfirmAdd} color="success">add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddChat;