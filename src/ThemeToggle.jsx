import React, { useState, useEffect } from 'react';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2z"></path>
        <path d="M9.5 19c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2z"></path>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
        <path d="M8 14h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M12 18c-2.28 0-4-2-4-3.5a.5.5 0 0 1 1 0c0 .83 1.34 2.5 3 2.5s3-1.67 3-2.5a.5.5 0 0 1 1 0c0 1.5-1.72 3.5-4 3.5z"></path>
    </svg>
);

const WaterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z"></path>
    </svg>
);

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 0-8 4-8 10c0 4 3 8 8 10c5-2 8-6 8-10c0-6-8-10-8-10Z"></path>
        <line x1="12" y1="2" x2="12" y2="22"></line>
    </svg>
);

export const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 21h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4"></path>
        <polyline points="8 17 3 12 8 7"></polyline>
        <line x1="3" y1="12" x2="15" y2="12"></line>
    </svg>
);

export default function ThemeToggle() {
    const themes = ['black-white', 'white-black', 'blue-grey', 'green-grey'];
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('theme') || themes[0];
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    const handleThemeToggle = () => {
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setCurrentTheme(themes[nextIndex]);
    };

    const renderIcon = () => {
        switch (currentTheme) {
            case 'black-white':
                return <SunIcon />;
            case 'white-black':
                return <MoonIcon />;
            case 'blue-grey':
                return <WaterIcon />;
            case 'green-grey':
                return <LeafIcon />;
            default:
                return <MoonIcon />;
        }
    };

    return (
        <div className="theme-switcher-container">
            <button id="theme-toggle-btn" onClick={handleThemeToggle} title="Change Theme">
                {renderIcon()}
            </button>
        </div>
    );
}