"use client"

import LoginCard from "../layouts/components/login-card";
import React from 'react'
import { Typography, Link } from "@mui/material";
import { useTheme } from '../contexts/ThemeContext';

const SignIn = () => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const mainStyle = {
    background: themeColors.bgColor,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "40px",
    padding: "20px",
    textAlign: "center"
  }
  return (
    <div style={mainStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start" }}>
        <Typography variant='h4' sx={{ color: themeColors.textColor }}>Sign in to your account</Typography>
        <div>
          <Typography variant="subtitle1" sx={{ color: themeColors.textColor }}>
            Or <Link href="/register" style={{ cursor: "pointer", color: themeColors.linkColor }}>create a new account</Link>
          </Typography>
        </div>
      </div>
      <LoginCard />
      <div>
        <Typography variant="body2">
          <Link href="/reset-password" style={{ cursor: "pointer", color: themeColors.linkColor }}>Forgot your password?</Link>
        </Typography>
      </div>
    </div>
  )
}

export default SignIn