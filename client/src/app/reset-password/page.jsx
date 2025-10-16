import ResetPasswordCard from "../components/reset-password-card";
import React from 'react'
import { Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";

const ResetPassword = () => {
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
                <Typography variant='h4' color="#3e4347">Reset Password</Typography>
                <div>
                    <Typography variant="subtitle1">
                        Remember your password? <MuiLink component={Link} href="/sign-in" style={{ cursor: "pointer" }} color="#3e4347">
                            Sign in
                        </MuiLink>
                    </Typography>
                </div>
            </div>
            <ResetPasswordCard />
        </div>
    )
}

export default ResetPassword
