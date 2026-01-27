import React from 'react';
import { Outlet } from 'react-router-dom';

const MobileLayout: React.FC = () => {
    return (
        <div className="mobile-layout">
            <Outlet />
        </div>
    );
};

export default MobileLayout;
