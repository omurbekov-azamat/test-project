import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {selectGroupMembers} from "../../messages/messagesSlice";
import {useAppSelector} from "../../../app/hook";
import {selectGroups} from "../groupsSlice";

interface Props {
    id: string;
}

const GroupMembers: React.FC<Props> = ({id}) => {
    const members = useAppSelector(selectGroupMembers);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const groups = useAppSelector(selectGroups);
    const foundObject = groups.find(item => Number(item.id) === Number(id));

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{color: 'white', fontSize: 16}}
            >
                {foundObject?.name}  <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {members.map((option) => (
                    <MenuItem key={option.username} onClick={handleClose}>
                        {option.username}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default GroupMembers;