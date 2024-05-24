import React from "react"
import { Link as RouteLink, Outlet } from "react-router-dom"
import { Container, List, ListItemButton, ListItemText } from "@mui/material"

const Dashboard = () => {
    return (
        <Container
            component="section"
            maxWidth="lg"
            sx={{
                p: 1,
                mb: 5,
                minHeight: {
                    xs: "calc( 100vh - 68.5px - 138px )",
                    md: "calc( 100vh - 68.5px - 160px )",
                    lg: "calc( 100vh - 68.5px - 148px )",
                },
            }}>
            <List sx={{ p: 2, display: "inline-flex" }}>
                <ListItemButton component={RouteLink} to="/Dashboard/addProduct">
                    <ListItemText primary="新增商品" />
                </ListItemButton>
                <ListItemButton component={RouteLink} to="/Dashboard/removeProduct">
                    <ListItemText primary="刪除商品" />
                </ListItemButton>
                <ListItemButton component={RouteLink} to="/Dashboard/editProduct">
                    <ListItemText primary="編輯商品" />
                </ListItemButton>
            </List>
            <Outlet />
        </Container>
    )
}

export default Dashboard
