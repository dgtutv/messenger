"use client"
import React, { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'

const RegisterCard = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        event.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();
            console.log('Success:', data);
            // Handle success (e.g., clear form, show success message)
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <Box style={mainStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <TextField style={formControlStyle} onChange={(event) => { setName(event.target.value) }} label="name" variant='outlined' />
                <TextField style={formControlStyle} onChange={(event) => { setEmail(event.target.value) }} label="email" variant='outlined' />
                <TextField style={formControlStyle} onChange={(event) => { setPassword(event.target.value) }} label="password" variant='outlined' type="password" autoComplete='current-password' />
                <Button style={formControlStyle} variant="contained">Register</Button>
            </form>
        </Box>
    )
}

export default RegisterCard;
