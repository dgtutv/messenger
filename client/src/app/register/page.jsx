"use client"

import RegisterCard from "../layouts/components/register-card";
import React from 'react'
import { Typography, Link, Box } from "@mui/material";

const Register = () => {
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
                <Typography variant='h4' color="text.primary">Create a new user</Typography>
                <Box>
                    <Typography variant="subtitle1" color="text.primary">
                        Or <Link href="/sign-in" sx={{ cursor: "pointer", color: 'primary.main' }}>sign into an existing account</Link>
                    </Typography>
                </Box>
            </Box>
            <RegisterCard />
        </Box>
    )
}

export default Register