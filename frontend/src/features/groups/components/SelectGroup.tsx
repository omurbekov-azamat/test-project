import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../app/hook";
import {selectUser} from "../../users/usersSlice";
import {getGroupMessages, getGroups} from "../groupsThunks";
import {selectGroups} from "../groupsSlice";
import {useNavigate} from "react-router-dom";

const SelectGroup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser)!;
    const groups = useAppSelector(selectGroups);

    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getGroups(user.token));
    }, [dispatch, user]);

    const handleInputChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        setSelectedGroup(null);
        navigate(`/groups/${value}`);
        dispatch(getGroupMessages({id:value, token: user.token}));
    };

    return (
        <FormControl sx={{mt:1}}>
            <InputLabel id="group-select-label">Groups</InputLabel>
            <Select
                labelId="group-select-label"
                id="group-select"
                label='Groups'
                value={selectedGroup || ''}
                onChange={handleInputChange}
                variant='standard'
                sx={{width: '370px', px: 2}}
            >
                <MenuItem value='' disabled>Select Group</MenuItem>
                {groups.map(group => (
                    <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectGroup;