import RegisterCard from "../components/register-card";
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
        gap: "40px"
    }
    return (
        <div style={mainStyle}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start" }}>
                <Typography variant='h4' color="#3e4347">Create a new user</Typography>
                <div>
                    <Typography variant="subtitle1">
                        Or <Link style={{ cursor: "pointer" }} color="#3e4347">sign up for a new account</Link>
                    </Typography>
                </div>
            </div>
            <RegisterCard />
        </div>
    )
}

export default app