import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex flex-col w-full justify-center items-center">
            <img
                className="absolute"
                src="https://i.ibb.co/1mc4sQ0/image.png"
            />
            {children}
        </main>
    );
};

export default Layout;
