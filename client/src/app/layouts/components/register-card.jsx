"use client"
import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'

const RegisterCard = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                // Clear form
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                // Redirect to verification page with email
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            }
            else {
                setError(data.error || "Registration failed. Please try again.");
            }
            setError(data.message || "Registration failed. Please try again.");
        }
        catch (error) {
            console.error('Error:', error);
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: "32px",
                width: "100%",
                maxWidth: "448px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <form onSubmit={handleSubmit} style={formStyle}>
                <TextField
                    required
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Name"
                    variant='outlined'
                />
                <TextField
                    required
                    type='email'
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email address"
                    variant='outlined'
                />
                <TextField
                    required
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    variant='outlined'
                    type="password"
                    autoComplete='new-password'
                />
                <TextField
                    required
                    fullWidth
                    value={confirmPassword}
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
                <Button type='submit' fullWidth variant="contained">Register</Button>
            </form>
        </Paper>
    )
}

export default RegisterCard;