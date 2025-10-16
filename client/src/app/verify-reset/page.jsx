"use client"

import VerifyResetCard from "../layouts/components/verify-reset-card";
import React from 'react'
import { Typography } from "@mui/material";
import { useTheme } from '../contexts/ThemeContext';

const VerifyReset = () => {
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
                <Typography variant='h4' sx={{ color: themeColors.textColor }}>Verify Reset Code</Typography>
                <Typography variant="subtitle1" sx={{ color: themeColors.textColor, opacity: 0.7 }}>
                    Enter the verification code sent to your email
                </Typography>
            </div>
            <VerifyResetCard />
        </div>
    )
}

export default VerifyReset
