"use client"

import VerifyEmailCard from "../layouts/components/verify-email-card";
import React from 'react'
import { Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { useTheme } from '../contexts/ThemeContext';

const VerifyEmail = () => {
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
                <Typography variant='h4' sx={{ color: themeColors.textColor }}>Verify Your Email</Typography>
                <div>
                    <Typography variant="subtitle1" sx={{ color: themeColors.textColor }}>
                        Already verified? <MuiLink component={Link} href="/sign-in" style={{ cursor: "pointer", color: themeColors.linkColor }}>
                            Sign in
                        </MuiLink>
                    </Typography>
                </div>
            </div>
            <VerifyEmailCard />
        </div>
    )
}

export default VerifyEmail
