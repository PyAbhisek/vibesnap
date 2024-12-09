import React, { useState, useEffect } from 'react';

const ScreenSizeRestriction = ({ children }) => {
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            // Adjust these breakpoints as needed
            setIsMobileOrTablet(window.innerWidth <= 1024);
        };

        // Check initial screen size
        checkScreenSize();

        // Add event listener to check screen size on resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup event listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (isMobileOrTablet) {
        return children;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-100 flex justify-center items-center z-50 p-5">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Oops! Desktop View Not Supported
                </h2>
                <p className="text-gray-600 mb-6">
                    Kindly open this application on a mobile device or tablet.
                </p>
                <div className="flex justify-center space-x-4 text-5xl">
                    <span>📱</span>
                    <span>📲</span>
                </div>
            </div>
        </div>
    );
};

export default ScreenSizeRestriction;