import LoginCard from "../components/login-card";
import React from 'react'
import { Typography, Link } from "@mui/material";

const app = () => {
  const mainStyle = {
    background: "#f9fafc",
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
        <Typography variant='h4' color="#3e4347">Sign in to your account</Typography>
        <div>
          <Typography variant="subtitle1">
            Or <Link href="/register" style={{ cursor: "pointer" }} color="#3e4347">create a new account</Link>
          </Typography>
        </div>
      </div>
      <LoginCard />
    </div>
  )
}

export default app