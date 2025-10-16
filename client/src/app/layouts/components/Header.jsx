import { useState } from 'react';
import "./layout.css"
import { IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from '../../contexts/ThemeContext.jsx';

const Header = () => {
    const { isMobile, getThemeColors } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const themeColors = getThemeColors();


    //MUI element stylings
    const hamburgerMenuStyle = {
        zIndex: 1300,
        color: themeColors.textColor,
    }

    const drawerStyle = {
        "& .MuiDrawer-paper": {
            width: "320px",
            maxWidth: "50vw",
            padding: "16px",
            backgroundColor: themeColors.headerBg,
            borderRight: `1px solid ${themeColors.borderColor}`,
            color: themeColors.textColor,
        },
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            {isMobile ? (
                <header style={{ backgroundColor: themeColors.headerBg, color: themeColors.textColor }}>
                    <Drawer
                        anchor="left"
                        open={mobileMenuOpen}
                        onClose={toggleMobileMenu}
                        sx={drawerStyle}
                    >
                    </Drawer>
                    <h1 style={{ color: themeColors.textColor }}>
                        Messenger
                    </h1>
                    <IconButton
                        sx={hamburgerMenuStyle}
                        onClick={toggleMobileMenu}
                        aria-label="open menu"
                    >
                        <MenuIcon />
                    </IconButton>
                </header>

            ) : (
                <header style={{ backgroundColor: themeColors.headerBg, color: themeColors.textColor }}>
                    <h1 style={{ color: themeColors.textColor }}>
                        Messenger
                    </h1>
                    <nav>
                    </nav>
                </header>
            )
            }
        </>



    );
};

export default Header;




