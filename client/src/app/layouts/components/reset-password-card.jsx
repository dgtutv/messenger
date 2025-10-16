"use client"
import React, { useState } from 'react'
import { Paper, TextField, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

const ResetPasswordCard = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
        setError("");
        setIsLoading(true);

        if (!email) {
            setError("Please enter your email");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to verification page with email and reset context
                router.push(`/verify-reset?email=${encodeURIComponent(email)}`);
            } else {
                setError(data.error || "Failed to send reset code. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Failed to send reset code. Please try again.");
        } finally {
            setIsLoading(false);
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
            <Typography variant="h5" align="center" gutterBottom>
                Reset Password
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                Enter your email to receive a reset code
            </Typography>
            <form onSubmit={handleSubmit} style={formStyle}>
                <TextField
                    required
                    type='email'
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email address"
                    variant='outlined'
                />
                {error && (
                    <Typography color="error" variant="body2">{error}</Typography>
                )}
                <Button
                    type='submit'
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
            </form>
        </Paper>
    )
}

export default ResetPasswordCard;
