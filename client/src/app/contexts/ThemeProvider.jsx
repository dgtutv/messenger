import { useState, useEffect, useCallback } from 'react';
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Dark/Light mode detection
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleThemeChange = (e) => {
            setIsDarkMode(e.matches);
        };

        // Set initial value
        setIsDarkMode(mediaQuery.matches);

        // Listen for changes
        mediaQuery.addEventListener('change', handleThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleThemeChange);
        };
    }, []);

    // Mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 450);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Get computed CSS variables
    const getThemeColors = useCallback(() => {
        // Check if running on client side
        if (typeof window === 'undefined') {
            // Return default values for SSR
            return {
                textColor: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : '#213547',
                bgColor: isDarkMode ? '#242424' : '#dde4e6ff',
                headerBg: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                linkColor: '#646cff',
                linkHover: isDarkMode ? '#535bf2' : '#747bff',
                cardBg: isDarkMode ? '#1b1b1bff' : '#ffffffff',
                boxShadow: isDarkMode ? 'rgba(0, 0, 0, 0.86)' : 'rgba(117, 117, 117, 0.86)',
            };
        }

        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        return {
            textColor: computedStyle.getPropertyValue('--text-color').trim() || (isDarkMode ? 'rgba(255, 255, 255, 0.87)' : '#213547'),
            bgColor: computedStyle.getPropertyValue('--bg-color').trim() || (isDarkMode ? '#242424' : '#dde4e6ff'),
            headerBg: computedStyle.getPropertyValue('--header-bg').trim() || (isDarkMode ? '#1a1a1a' : '#f8f9fa'),
            borderColor: computedStyle.getPropertyValue('--border-color').trim() || (isDarkMode ? '#404040' : '#e0e0e0'),
            linkColor: computedStyle.getPropertyValue('--link-color').trim() || '#646cff',
            linkHover: computedStyle.getPropertyValue('--link-hover').trim() || (isDarkMode ? '#535bf2' : '#747bff'),
            cardBg: computedStyle.getPropertyValue('--card-bg').trim() || (isDarkMode ? '#1b1b1bff' : '#ffffffff'),
            boxShadow: computedStyle.getPropertyValue('--box-shadow').trim() || (isDarkMode ? 'rgba(0, 0, 0, 0.86)' : 'rgba(117, 117, 117, 0.86)'),
        };
    }, [isDarkMode]);

    const value = {
        isDarkMode,
        isMobile,
        getThemeColors,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};