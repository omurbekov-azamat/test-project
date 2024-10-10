import React from 'react';
import {NavLink} from "react-router-dom";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { apiURL } from "../../../constants";
import { User } from "../../../types";
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {selectUser} from "../../users/usersSlice";
import {getMessages} from "../../messages/messagesThunks";

interface Props {
    user: User;
}

const ListUser: React.FC<Props> = ({ user }) => {
    const dispatch = useAppDispatch();
    const member = useAppSelector(selectUser)!;

    let image: string;

    if (user.image && user.image.length < 50) {
        image = apiURL + '/' + user.image;
    } else {
        image = user.image || '';
    }

    const onClick = async (id: string) => {
        await dispatch(getMessages({ id, token: member.token }));
    };

    return (
        <ListItem
            sx={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                padding: '10px 20px',
                width: '100%',
                maxWidth: '400px',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            }}
            component={NavLink}
            to={'/' + user.id}
            onClick={() => onClick(user.id)}
        >
            <ListItemAvatar>
                <Avatar alt={user.username} src={image} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="body1" fontWeight="bold">
                        {user.username}
                    </Typography>
                }
                secondary={
                    <Typography variant="body2" color={user.online ? 'green' : 'red'}>
                        {user.online ? 'Online' : 'Offline'}
                    </Typography>
                }
            />
        </ListItem>
    );
};

export default ListUser;
