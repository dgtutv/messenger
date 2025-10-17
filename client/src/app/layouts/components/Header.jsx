import { useState } from 'react';
import "./layout.css"
import { IconButton, Drawer, Button, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useRouter } from 'next/navigation';

const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                router.push('/sign-in');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            {isMobile ? (
                <Box
                    component="header"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 2rem',
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        margin: 0,
                    }}
                >
                    <Drawer
                        anchor="left"
                        open={mobileMenuOpen}
                        onClose={toggleMobileMenu}
                        sx={{
                            "& .MuiDrawer-paper": {
                                width: "320px",
                                maxWidth: "50vw",
                                padding: "16px",
                                bgcolor: 'background.paper',
                                borderRight: 1,
                                borderColor: 'divider',
                            },
                        }}
                    >
                        <Button variant="contained" onClick={handleLogout} >
                            Logout
                        </Button>
                    </Drawer>
                    <Typography variant="h5" component="h1" color="text.primary">
                        Messenger
                    </Typography>
                    <IconButton
                        sx={{ zIndex: 1300, color: 'text.primary' }}
                        onClick={toggleMobileMenu}
                        aria-label="open menu"
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

            ) : (
                <Box
                    component="header"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 2rem',
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        margin: 0,
                    }}
                >
                    <Typography variant="h5" component="h1" color="text.primary">
                        Messenger
                    </Typography>
                    <Box component="nav">
                        <Button variant='contained' onClick={handleLogout}>
                            Sign out
                        </Button>
                    </Box>
                </Box>
            )
            }
        </>
    );
};

export default Header;




