import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContextData } from '../Context/contextData';

//context so home navlink can toggle flag


const CustomNavLink = ({ to, children }) => {
    const { changeFlag } = useContextData();

    const handleClick = () => {
        changeFlag();
    };

    return (
        <NavLink to={to} onClick={handleClick}>
            {children}
        </NavLink>
    );
};

export default CustomNavLink;