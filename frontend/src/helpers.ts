import {Link as NavLink} from 'react-router-dom';
import {styled} from '@mui/material';

export const Link = styled(NavLink)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        color: 'inherit'
    },
});
