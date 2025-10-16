"use client"

import VerifyResetCard from "../layouts/components/verify-reset-card";
import React from 'react'
import { Typography, Box } from "@mui/material";

const VerifyReset = () => {
    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "40px",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start" }}>
                <Typography variant='h4' color="text.primary">Verify Reset Code</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Enter the verification code sent to your email
                </Typography>
            </Box>
            <VerifyResetCard />
        </Box>
    )
}

export default VerifyReset