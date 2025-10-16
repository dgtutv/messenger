"use client"
import React, { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'

const VerifyEmailCard = () => {
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email');

    const [email, setEmail] = useState(emailFromUrl || "");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const router = useRouter();

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
        setError("");

        if (!email || !code) {
            setError("Please enter both email and verification code");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/sign-in');
                }, 2000);
            } else {
                setError(data.error || "Verification failed. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Verification failed. Please try again.");
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setError("");

        try {
            const response = await fetch('http://localhost:8080/api/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setError("");
                alert("Verification code resent! Please check your email.");
            } else {
                setError(data.error || "Failed to resend code.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    if (success) {
        return (
            <Box style={mainStyle}>
                <Typography variant="h6" color="success.main" align="center">
                    ✅ Email verified successfully!
                </Typography>
                <Typography variant="body2" align="center">
                    Redirecting to login...
                </Typography>
            </Box>
        );
    }

    return (
        <Box style={mainStyle}>
            <Typography variant="h5" align="center" gutterBottom>
                Verify Your Email
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                Enter the 6-digit code sent to your email
            </Typography>
            <form onSubmit={handleSubmit} style={formStyle}>
                <TextField
                    required
                    type='email'
                    style={formControlStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email address"
                    variant='outlined'
                    disabled={!!emailFromUrl}
                />
                <TextField
                    required
                    style={formControlStyle}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    label="Verification Code"
                    variant='outlined'
                    inputProps={{ maxLength: 6 }}
                    placeholder="000000"
                />
                {error && (
                    <Typography color="error" variant="body2">{error}</Typography>
                )}
                <Button type='submit' style={formControlStyle} variant="contained">
                    Verify Email
                </Button>
                <Button
                    onClick={handleResend}
                    style={formControlStyle}
                    variant="text"
                    disabled={isResending || !email}
                >
                    {isResending ? "Sending..." : "Resend Code"}
                </Button>
            </form>
        </Box>
    )
}

export default VerifyEmailCard;
