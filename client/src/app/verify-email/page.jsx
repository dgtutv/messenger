import VerifyEmailCard from "../components/verify-email-card";
import React from 'react'
import { Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";

const VerifyEmail = () => {
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
                <Typography variant='h4' color="#3e4347">Verify Your Email</Typography>
                <div>
                    <Typography variant="subtitle1">
                        Already verified? <Link href="/sign-in" passHref legacyBehavior>
                            <MuiLink style={{ cursor: "pointer" }} color="#3e4347">
                                Sign in
                            </MuiLink>
                        </Link>
                    </Typography>
                </div>
            </div>
            <VerifyEmailCard />
        </div>
    )
}

export default VerifyEmail
