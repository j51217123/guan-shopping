import React, { useState, useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon } from "@mui/icons-material"
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    Link,
    Tooltip,
    MenuItem,
} from "@mui/material"
import { setLogout } from "../../Redux/Store/userSlice"
import { handleLogoutAuth } from "../../Utils/firebase"
import Logo from "../../Assets/Images/logo-2.png"

const Header = () => {
    const userState = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)
    useEffect(() => {}, [userState.profile])
    const pages = ["Home", "Products", "Login", "Dashboard"]
    const settings = ["訂單紀錄", "登出"]
    const menuRoutes = [
        {
            path: "/login",
            query: "登入",
        },
        {
            path: "/",
            query: "登出",
        },
    ]

    const handleOpenNavMenu = event => {
        setAnchorElNav(event.currentTarget)
    }
    const handleOpenUserMenu = event => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = setting => {
        if (setting.currentTarget.innerText === "登出") {
            dispatch(setLogout())
            handleLogoutAuth()
        }
        setAnchorElUser(null)
    }

    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: "#fff", boxShadow: "0 2px 6px 0 rgb(0 0 0 / 6%)", color: "#323232" }}>
            <Container component="section">
                <Toolbar disableGutters>
                    <Link
                        component={RouterLink}
                        to="/"
                        underline="none"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                        }}>
                        <img className="nav-logo" src={Logo} alt="Porousway Logo" width="40" height="40" />
                    </Link>
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}>
                        官小二
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}>
                            {pages.map(page => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography
                                        component={RouterLink}
                                        sx={{ color: "inherit", textDecoration: "none" }}
                                        to={`${page === "Home" ? "/" : `/${page}`}`}
                                        textAlign="center">
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Link
                        href="/"
                        underline="none"
                        sx={{
                            display: { xs: "flex", md: "none" },
                            width: "100%",
                            justifyContent: "center",
                        }}>
                        <img className="nav-logo" src={Logo} alt="Porousway Logo" width="40" height="40" />
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex", justifyContent: "flex-end" } }}>
                        {pages.map(page => (
                            <Button
                                component={RouterLink}
                                to={`${page === "Home" ? "/" : `/${page}`}`}
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "#323232",
                                    display: "block",
                                    ":hover": {
                                        backgroundColor: "unset",
                                    },
                                    ":before": {
                                        content: '""',
                                        position: "absolute",
                                        width: "100%",
                                        height: "4px",
                                        borderRadius: "4px",
                                        backgroundColor: "#18272F",
                                        bottom: 0,
                                        left: 0,
                                        transformOrigin: "right",
                                        transform: "scaleX(0)",
                                        transition: "transform .3s ease-in-out",
                                    },
                                    ":hover::before": {
                                        transformOrigin: "left",
                                        transform: "scaleX(1)",
                                    },
                                }}>
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit">
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>
                            {userState.profile.login ? (
                                settings.map((setting, index) => (
                                    <MenuItem
                                        component={RouterLink}
                                        to={`${
                                            setting === menuRoutes[index]?.query ? `${menuRoutes[index]?.path}` : `/`
                                        }`}
                                        key={setting}
                                        onClick={setting => {
                                            handleCloseUserMenu(setting)
                                        }}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem
                                    component={RouterLink}
                                    to="/login"
                                    onClick={setting => {
                                        handleCloseUserMenu(setting)
                                    }}>
                                    <Typography textAlign="center">登入</Typography>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default Header
