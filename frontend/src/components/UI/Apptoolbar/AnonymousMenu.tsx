import React from 'react';
import {Link as NavLink} from "react-router-dom";
import {Button} from "@mui/material";

const AnonymousMenu = () => {
    return (
        <>
            <Button component={NavLink} to='/register' color='inherit'>Sign up</Button>
            <Button component={NavLink} to='/login' color='inherit'>Sign in</Button>
        </>
    );
};

export default AnonymousMenu;