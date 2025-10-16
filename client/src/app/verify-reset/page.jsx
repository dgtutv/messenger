import VerifyResetCard from "../components/verify-reset-card";
import React from 'react'
import { Typography } from "@mui/material";

const VerifyReset = () => {
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
                <Typography variant='h4' color="#3e4347">Verify Reset Code</Typography>
                <Typography variant="subtitle1" color="#6b7278">
                    Enter the verification code sent to your email
                </Typography>
            </div>
            <VerifyResetCard />
        </div>
    )
}

export default VerifyReset
