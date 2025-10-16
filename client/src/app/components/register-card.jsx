"use client"
import React, { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'

const RegisterCard = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Check password length (optional)
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            console.log('Success:', data);
            // Handle success (e.g., clear form, show success message)
        } catch (error) {
            console.error('Error:', error);
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <Box style={mainStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <TextField required style={formControlStyle} onChange={(e) => setName(e.target.value)} label="Name" variant='outlined' />
                <TextField required type='email' style={formControlStyle} onChange={(e) => setEmail(e.target.value)} label="Email address" variant='outlined' />
                <TextField
                    required
                    style={formControlStyle}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    variant='outlined'
                    type="password"
                    autoComplete='new-password'
                />
                <TextField
                    required
                    style={formControlStyle}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    label="Confirm password"
                    variant='outlined'
                    type="password"
                    autoComplete='new-password'
                    error={error === "Passwords do not match"}
                    helperText={error === "Passwords do not match" ? error : ""}
                />
                {error && error !== "Passwords do not match" && (
                    <Typography color="error" variant="body2">{error}</Typography>
                )}
                <Button type='submit' style={formControlStyle} variant="contained">Register</Button>
            </form>
        </Box>
    )
}

export default RegisterCard;