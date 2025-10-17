"use client"
import React, { useState } from 'react'
import { Paper, TextField, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); // Clear previous errors

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'  // ← Send and save cookies
            });

            const data = await response.json();

            if (response.ok) {
                // Clear form
                setEmail("");
                setPassword("");

                // Redirect to home
                router.push('/');
            }
            else {
                // Check if error is about email verification
                if (data.error && data.error.includes("verify your email")) {
                    // Redirect to verification page with email
                    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                } else {
                    setError(data.error || "Login failed. Please try again.");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Login failed. Please try again.");
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
                    type='email'
                    fullWidth
                    value={email}
                    onChange={(event) => { setEmail(event.target.value) }}
                    label="Email address"
                    variant='outlined'
                />
                <TextField
                    required
                    fullWidth
                    value={password}
                    onChange={(event) => { setPassword(event.target.value) }}
                    label="Password"
                    variant='outlined'
                    type="password"
                    autoComplete='current-password'
                />
                {error && (
                    <Typography color="error" variant="body2">{error}</Typography>
                )}
                <Button type='submit' fullWidth variant="contained">Sign in</Button>
            </form>
        </Paper>
    )
}

export default LoginCard;
