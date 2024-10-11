import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Box,
    DialogActions,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { addUser, getUsers } from "../../../features/users/usersThunks";
import { selectUser } from "../../../features/users/usersSlice";

const AddChat: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser)!;

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setUsername('');
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleConfirmAdd = async () => {
        if (!username.trim()) return;
        await dispatch(addUser({ username, token: user.token }));
        await dispatch(getUsers(user.token));
        handleClose();
    };

    if (user.is_admin) return null;

    return (
        <Box textAlign="center">
            <Button variant='contained' onClick={handleClickOpen} sx={{color: 'white'}}>
                Add user
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add user</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirmAdd} color="success">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddChat;