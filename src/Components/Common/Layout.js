import { Outlet } from "react-router-dom"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import { Box } from "@mui/material"

const Layout = ({ isLogin }) => (
    <Box>
        <Header isLogin={isLogin} />
        <ShoppingCart />
        <Outlet />
        <Footer />
    </Box>
)

export default Layout
