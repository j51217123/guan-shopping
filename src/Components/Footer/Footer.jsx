import React from "react"
import { Box, Typography, Container, Link } from "@mui/material"
import { styled } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import FacebookIcon from "@mui/icons-material/Facebook"
import MailIcon from "../../Assets/Images/gmail-icon.svg"
import InstagramIcon from "../../Assets/Images/instagram-icon.svg"

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            {"Copyright © "}
            <Link color="inherit" href="/">
                官小二
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    )
}

const ContactLink = styled(Link)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    display: "flex",
    alignItems: "center",
}))

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                display: "flex",
                flexDirection: "column",
                // minHeight: {
                //     xs: "calc( 100vh - 68.5px - 1294px )",
                //     md: "calc( 100vh - 68.5px - 830px )",
                //     lg: "calc( 100vh - 68.5px - 557px )",
                // },
            }}>
            <CssBaseline />
            <Box
                component="section"
                sx={{
                    py: 3,
                    px: 2,
                    mt: "auto",
                    backgroundColor: theme =>
                        theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[800],
                }}>
                <Container maxWidth="sm">
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}>
                        <ContactLink href="mailto:free19980515@qq.com" underline="none" title="guanyyds">
                            <img src={MailIcon} alt="" width="24" height="24" />
                            <Typography
                                component="span"
                                sx={{
                                    whiteSpace: "nowrap",
                                    fontWeight: "bold",
                                    marginLeft: "8px",
                                    display: { xs: "none", md: "block", lg: "block" },
                                    ":hover": {
                                        filter: "brightness(120%)",
                                    },
                                }}>
                                電子信箱
                            </Typography>
                        </ContactLink>
                        <ContactLink
                            color={"#0064e0"}
                            href="https://www.facebook.com/guanyyds?mibextid=ZbWKwL"
                            underline="none"
                            title="guanyyds">
                            <FacebookIcon />
                            <Typography
                                component="span"
                                sx={{
                                    whiteSpace: "nowrap",
                                    fontWeight: "bold",
                                    marginLeft: "5px",
                                    display: { xs: "none", md: "block", lg: "block" },
                                    ":hover": {
                                        filter: "brightness(120%)",
                                    },
                                }}>
                                Facebook 粉絲專頁
                            </Typography>
                        </ContactLink>
                        <ContactLink href="https://www.instagram.com/guanyyds/" underline="none" title="guanyyds">
                            <img src={InstagramIcon} alt="" width="24" height="24" />
                            <Typography
                                component="span"
                                sx={{
                                    whiteSpace: "nowrap",
                                    fontWeight: "bold",
                                    marginLeft: "5px",
                                    display: { xs: "none", md: "block", lg: "block" },
                                    ":hover": {
                                        filter: "brightness(120%)",
                                    },
                                }}>
                                官方 Instagram
                            </Typography>
                        </ContactLink>
                    </Box>
                    <Copyright />
                </Container>
            </Box>
        </Box>
    )
}

export default Footer
