import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <img
                className="absolute"
                src="https://i.ibb.co/1mc4sQ0/image.png"
            />
            {children}
        </div>
    );
};

export default Layout;
