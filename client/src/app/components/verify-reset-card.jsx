"use client"
import React, { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'

const VerifyResetCard = () => {
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email');

    const [email, setEmail] = useState(emailFromUrl || "");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // 1: verify code, 2: set new password
    const [isLoading, setIsLoading] = useState(false);
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

    const handleVerifyCode = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !code) {
            setError("Please enter both email and verification code");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setStep(2); // Move to password reset step
            } else {
                setError(data.error || "Invalid verification code. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code, newPassword }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    router.push('/sign-in');
                }, 1500);
            } else {
                setError(data.error || "Password reset failed. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Password reset failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        setError("");

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
                alert("Verification code resent! Please check your email.");
            } else {
                setError(data.error || "Failed to resend code.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Failed to resend code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 1) {
        // Step 1: Verify code
        return (
            <Box style={mainStyle}>
                <Typography variant="h5" align="center" gutterBottom>
                    Verify Code
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                    Enter the 6-digit code sent to your email
                </Typography>
                <form onSubmit={handleVerifyCode} style={formStyle}>
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
                    <Button
                        type='submit'
                        style={formControlStyle}
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                    <Button
                        onClick={handleResend}
                        style={formControlStyle}
                        variant="text"
                        disabled={isLoading || !email}
                    >
                        {isLoading ? "Sending..." : "Resend Code"}
                    </Button>
                </form>
            </Box>
        );
    }

    // Step 2: Set new password
    return (
        <Box style={mainStyle}>
            <Typography variant="h5" align="center" gutterBottom>
                Set New Password
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                Enter your new password
            </Typography>
            <form onSubmit={handleResetPassword} style={formStyle}>
                <TextField
                    required
                    style={formControlStyle}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    label="New Password"
                    variant='outlined'
                    type="password"
                    autoComplete='new-password'
                />
                <TextField
                    required
                    style={formControlStyle}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    label="Confirm New Password"
                    variant='outlined'
                    type="password"
                    autoComplete='new-password'
                    error={error === "Passwords do not match"}
                    helperText={error === "Passwords do not match" ? error : ""}
                />
                {error && error !== "Passwords do not match" && (
                    <Typography color="error" variant="body2">{error}</Typography>
                )}
                <Button
                    type='submit'
                    style={formControlStyle}
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </Box>
    );
}

export default VerifyResetCard;
