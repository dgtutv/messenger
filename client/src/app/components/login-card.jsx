"use client"
import React, { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'

const LoginCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const mainStyle = {
        background: "white",
        padding: "32px",
        width: "100%",
        maxWidth: "448px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
    }

    const formStyle = {
        width: "100%",
        padding: "0",
        margin: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px"
    }

    const formControlStyle = {
        width: "100%",

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); // Clear previous errors

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed. Please try again.");
                return;
            }

            console.log('Success:', data);
            // Handle success (e.g., redirect to dashboard, store token)
        } catch (error) {
            console.error('Error:', error);
            setError("Login failed. Please try again.");
        }
    };

    return (
        <Box style={mainStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <TextField
                    required
                    type='email'
                    style={formControlStyle}
                    onChange={(event) => { setEmail(event.target.value) }}
                    label="Email address"
                    variant='outlined'
                />
                <TextField
                    required
                    style={formControlStyle}
                    onChange={(event) => { setPassword(event.target.value) }}
                    label="Password"
                    variant='outlined'
                    type="password"
                    autoComplete='current-password'
                />
                {error && (
                    <Typography color="error" variant="body2">{error}</Typography>
                )}
                <Button type='submit' style={formControlStyle} variant="contained">Sign in</Button>
            </form>
        </Box>
    )
}

export default LoginCard;
