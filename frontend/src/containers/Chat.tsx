import React, {useEffect} from 'react';
import {getUsers} from "../features/users/usersThunks";
import {useAppDispatch, useAppSelector} from "../app/hook";
import {selectUser, selectUsers} from "../features/users/usersSlice";
import ListUsers from "../features/chats/components/ListUsers";

const Chat = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    const user = useAppSelector(selectUser);
    const token = user?.token || null;

    useEffect(() => {
        dispatch(getUsers(token));
    }, [dispatch]);

    return (
        <ListUsers users={users}/>
    );
};

export default Chat;