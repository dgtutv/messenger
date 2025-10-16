"use client"

import RegisterCard from "../layouts/components/register-card";
import React from 'react'
import { Typography, Link } from "@mui/material";
import { useTheme } from '../contexts/ThemeContext';

const Register = () => {
    const { getThemeColors } = useTheme();
    const themeColors = getThemeColors();

    const mainStyle = {
        background: themeColors.bgColor,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "40px",
        padding: "20px",
        textAlign: "center"
    }
    return (
        <div style={mainStyle}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start" }}>
                <Typography variant='h4' sx={{ color: themeColors.textColor }}>Create a new user</Typography>
                <div>
                    <Typography variant="subtitle1" sx={{ color: themeColors.textColor }}>
                        Or <Link href="/sign-in" style={{ cursor: "pointer", color: themeColors.linkColor }}>sign into an existing account</Link>
                    </Typography>
                </div>
            </div>
            <RegisterCard />
        </div>
    )
}

export default Register