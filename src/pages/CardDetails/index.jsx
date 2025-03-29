import React from 'react';
import { Outlet } from 'react-router-dom';

const CardDetails = () => {
    return (
        <div className='card-info-wrapper'>
            <Outlet />
        </div>
    );
};

export default CardDetails;