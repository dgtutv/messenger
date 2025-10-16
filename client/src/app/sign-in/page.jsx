"use client"

import LoginCard from "../layouts/components/login-card";
import React from 'react'
import { Typography, Link, Box } from "@mui/material";

const SignIn = () => {
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
        <Typography variant='h4' color="text.primary">Sign in to your account</Typography>
        <Box>
          <Typography variant="subtitle1" color="text.primary">
            Or <Link href="/register" sx={{ cursor: "pointer", color: 'primary.main' }}>create a new account</Link>
          </Typography>
        </Box>
      </Box>
      <LoginCard />
      <Box>
        <Typography variant="body2">
          <Link href="/reset-password" sx={{ cursor: "pointer", color: 'primary.main' }}>Forgot your password?</Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default SignIn