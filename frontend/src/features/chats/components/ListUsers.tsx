import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {getUsers} from "../../users/usersThunks";
import {selectUser, selectUsers} from "../../users/usersSlice";
import ListUser from "./ListUser";
import {User} from "../../../types";

const ListUsers = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (user) {
            dispatch(getUsers(user.token));
        }
    }, [dispatch, user]);

    return (
        <>
            {users.map((user: User) => (
                <ListUser key={user.id} user={user}/>
            ))}
        </>
    );
};

export default ListUsers