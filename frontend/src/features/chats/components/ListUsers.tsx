import React from 'react';
import ListUser from "./ListUser";
import {User} from "../../../types";

interface Props {
    users: User[];
}

const ListUsers: React.FC<Props> = ({users}) => {
    return (
        <>
            {users.map((user: User) => (
                <ListUser key={user.id} user={user}/>
            ))}
        </>
    );
};

export default ListUsers