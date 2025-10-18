"use client"
import { Box } from '@mui/system'
import { Paper, Typography, TextField, Button, Link } from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function page() {
    const [username, setUsername] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const formStyle = {
        width: "100%",
        padding: "0",
        margin: "0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px"
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/change-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ newUsername: username })
            });

            const data = await response.json();

            if (response.ok) {
                setUsername("");
                router.push("/")
            }
            else {
                setError(data.error || "Username change failed. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Username change failed. Please try again.");
        }
    }
    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "column",
                gap: "40px",
                padding: "20px",
                textAlign: "center"
            }}>
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
                    alignItems: "flex-start",
                    gap: "40px"
                }}
            >
                <Typography variant="h4">
                    Edit User
                </Typography>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <TextField
                        type='username'
                        value={username}
                        onChange={(event) => { setUsername(event.target.value) }}
                        label="Username"
                        variant='outlined'
                        sx={{ flexGrow: 4 }}
                    />
                    <Button type='submit' variant="contained" sx={{ flexGrow: 3 }}>Save</Button>
                </form>
                {error && (
                    <Typography color="error" variant="body2">{error}</Typography>
                )}
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Link href="/reset-password" sx={{ cursor: "pointer", color: 'primary.main' }}>Change password</Link>
                    <Button variant='contained' color='error'>Delete</Button>
                </Box>

            </Paper>
        </Box>
    )
}
