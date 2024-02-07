import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            {children}
        </div>
    );
};

export default Layout;
