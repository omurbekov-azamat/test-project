import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Checkbox, FormControlLabel, FormGroup, Menu, TextField} from "@mui/material";
import {useState} from "react";
import {useAppSelector} from "../../../app/hook";
import {selectUsers} from "../../users/usersSlice";
import {v4 as uuidv4} from "uuid";

const style = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const initialState = {
    groupName: '',
};

const CreateGroup = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const handleOpen = () => setOpen(true);
    const users = useAppSelector(selectUsers);

    const [chooseUsers, setChooseUsers] = useState<string[]>([]);


    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClickOpenChooseUsers = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickCloseChooseUsers = () => {
        setAnchorEl(null);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData(initialState);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleChangeCheckBox = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        if (checked) {
            const result = users.find(item => item.username === name);
            if (result && !chooseUsers.includes(result.id)) {
                setChooseUsers(prev => [...prev, result.id]);
            }
        } else {
            setChooseUsers(prev => prev.filter(item => item !== name));
        }
    };

    const submitFormHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log({
            groupName: formData.groupName,
            users: chooseUsers,
        });
        handleClose();
    };

    return (
        <>
            <Button color='success' variant='contained' onClick={handleOpen}>Create Group</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} textAlign="center">
                    <Typography id="modal-modal-title" variant="h6" component="h2" mb={1}>Create group</Typography>
                    <Box component='form' onSubmit={submitFormHandler}>
                        <TextField
                            label='Group Name'
                            name='groupName'
                            value={formData.groupName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                            <Button
                                fullWidth
                                onClick={handleClickOpenChooseUsers}
                                sx={{
                                    color: 'grey',
                                    height: '39px',
                                    border: '1px solid lightblue',
                                    textTransform: 'capitalize',
                                    fontSize: '18px',
                                    width: '100%'
                                }}
                            >
                                Choose users
                            </Button>
                            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)}
                                  onClose={handleClickCloseChooseUsers}>
                                <FormGroup sx={{p: 1, width: '100%'}}>
                                    {users && users.length > 0 ? users.map((user) => (
                                        <FormControlLabel
                                            key={uuidv4()}
                                            control={<Checkbox onChange={handleChangeCheckBox} name={user.username}/>}
                                            label={user.username}/>
                                    )) : (<Typography>no users</Typography>)}
                                </FormGroup>
                            </Menu>
                        <Button type="submit" fullWidth>create</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CreateGroup;