"use client"

import VerifyEmailCard from "../layouts/components/verify-email-card";
import React from 'react'
import { Typography, Link as MuiLink, Box } from "@mui/material";
import Link from "next/link";

const VerifyEmail = () => {
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
                <Typography variant='h4' color="text.primary">Verify Your Email</Typography>
                <Box>
                    <Typography variant="subtitle1" color="text.primary">
                        Already verified? <MuiLink component={Link} href="/sign-in" sx={{ cursor: "pointer", color: 'primary.main' }}>
                            Sign in
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
            <VerifyEmailCard />
        </Box>
    )
}

export default VerifyEmail