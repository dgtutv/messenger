"use client"

import Header from './Header';
import { usePathname } from 'next/navigation';
import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ConversationProvider } from '../../contexts/ConversationContext';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                    primary: {
                        main: '#646cff',
                    },
                    background: {
                        default: prefersDarkMode ? '#242424' : '#dde4e6ff',
                        paper: prefersDarkMode ? '#1b1b1bff' : '#ffffff',
                    },
                    text: {
                        primary: prefersDarkMode ? 'rgba(255, 255, 255, 0.87)' : '#213547',
                    },
                },
            }),
        [prefersDarkMode]
    );

    // Hide header on auth pages
    const authPages = ['/sign-in', '/register', '/verify-email', '/reset-password', '/verify-reset'];
    const showHeader = !authPages.includes(pathname);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ConversationProvider>
                {showHeader && <Header />}
                {children}
            </ConversationProvider>
        </ThemeProvider>
    );
}