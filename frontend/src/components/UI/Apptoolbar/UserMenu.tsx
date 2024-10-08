import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getUsers, logout} from '../../../features/users/usersThunks';
import {selectLogoutLoading} from "../../../features/users/usersSlice";
import {Avatar, Button, Grid, Menu, MenuItem} from '@mui/material';
import {apiURL} from '../../../constants';
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {User} from '../../../types';

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loading = useAppSelector(selectLogoutLoading);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logout(user.token));
        await dispatch(getUsers());
        await navigate('/');
    };

    let image:string;

    if (user.image && user.image.length < 50) {
        image = user.image && apiURL + '/' + user.image;
    } else {
        image = user.image
    }

    return (
        <>
            <Grid container>
                <Grid item>
                    <Avatar alt={user.username} src={image}/>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleClick}
                        color="inherit"
                    >
                        Hello, {user.username}
                    </Button>
                </Grid>
            </Grid>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout} disabled={loading}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;