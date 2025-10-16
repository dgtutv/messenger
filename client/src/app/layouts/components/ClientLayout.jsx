"use client"

import { ThemeProvider } from '../../contexts/ThemeProvider';
import Header from './Header';
import { usePathname } from 'next/navigation';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';

function MuiThemeWrapper({ children }) {
    const { isDarkMode } = useTheme();

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? 'dark' : 'light',
                    primary: {
                        main: isDarkMode ? '#646cff' : '#646cff',
                    },
                    background: {
                        default: isDarkMode ? '#242424' : '#dde4e6ff',
                        paper: isDarkMode ? '#1b1b1bff' : '#ffffff',
                    },
                    text: {
                        primary: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : '#213547',
                    },
                },
            }),
        [isDarkMode]
    );

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}

export default function ClientLayout({ children }) {
    const pathname = usePathname();

    // Hide header on auth pages
    const authPages = ['/sign-in', '/register', '/verify-email', '/reset-password', '/verify-reset'];
    const showHeader = !authPages.includes(pathname);

    return (
        <ThemeProvider>
            <MuiThemeWrapper>
                {showHeader && <Header />}
                {children}
            </MuiThemeWrapper>
        </ThemeProvider>
    );
}