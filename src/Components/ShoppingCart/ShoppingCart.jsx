import * as React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link as RouterLink } from "react-router-dom"
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material"
import { Avatar, Box, Button, Drawer, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material"
import productSlice from "../../Redux/Product/ProductSlice"

const { setIncrement, setDecrement, setRemove } = productSlice.actions

const ShoppingCart = () => {
    const dispatch = useDispatch()
    const param = useParams()
    const orderList = useSelector(state => state.products.orderList)
    const [drawerOpen, setDrawerOpen] = React.useState(false)

    const handleIncrement = title => dispatch(setIncrement(title))

    const handleDecrement = title => dispatch(setDecrement(title))

    const handleRemove = productId => dispatch(setRemove({ productId }))

    return param["*"] !== "Checkout" &&
        param["*"] !== "login" &&
        param["*"] !== "Dashboard" &&
        param["*"] !== "Dashboard/addProduct" &&
        param["*"] !== "Dashboard/removeProduct" &&
        param["*"] !== "Dashboard/editProduct" ? (
        <Box
            sx={{
                position: "fixed",
                right: {
                    xs: 0,
                    md: 0,
                    lg: "5%",
                },
                top: "40%",
                zIndex: "2",
            }}>
            <Button onClick={() => setDrawerOpen(true)}>
                <Avatar>
                    <ShoppingCartIcon />
                </Avatar>
                {orderList.length > 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            right: "15%",
                            top: "5%",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            color: "white",
                            background: "red",
                            fontSize: "12px",
                        }}>
                        {orderList.length}
                    </Box>
                ) : null}
            </Button>
            <Drawer anchor="right" sx={{ width: "250px" }} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Typography
                    align="left"
                    sx={{ pt: 4, pb: 2, pl: 3.5, fontWeight: "bold" }}
                    variant="h6"
                    component="div">
                    購物車
                </Typography>
                {orderList.length > 0 ? (
                    <List sx={{ width: "250px" }}>
                        {orderList.map(item => {
                            console.log(item,'iiitem');
                            return (
                                <ListItem
                                    key={item.title}
                                    sx={{
                                        background: "#ededed",
                                        padding: "20px",
                                        gap: "20px",
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => {
                                                console.log("item.productId:", item)
                                                handleRemove(item.productId)
                                            }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }>
                                    <Box
                                        component="img"
                                        width="50px"
                                        height="50px"
                                        src={item.mainImg}
                                        sx={{ objectFit: "contain", background: "white" }}
                                    />
                                    <ListItem
                                        component="div"
                                        sx={{
                                            flexDirection: "column",
                                            padding: 0,
                                            width: "80px",
                                            height: "50px",
                                            justifyContent: "flex-end",
                                        }}>
                                        <ListItemText primary={item.title} sx={{ fontWeight: "bold" }} />
                                        <Button
                                            variant="outlined"
                                            component="div"
                                            sx={{
                                                padding: 0,
                                                borderRadius: "40px",
                                                backgroundColor: "white",
                                                borderColor: "#e0e0e0",
                                                width: "80px",
                                                height: "40px",
                                                gap: "5px",
                                                ":hover": {
                                                    borderColor: "#e0e0e0",
                                                    backgroundColor: "white",
                                                },
                                            }}>
                                            <IconButton
                                                aria-label="remove"
                                                size="small"
                                                sx={{
                                                    width: "16px",
                                                    height: "16px",
                                                }}
                                                disabled={item.quantity === 1}
                                                onClick={() => handleDecrement(item.title)}>
                                                <RemoveIcon fontSize="inherit" />
                                            </IconButton>
                                            <Typography component="span" variant="button">
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                aria-label="add"
                                                size="small"
                                                sx={{ width: "16px", height: "16px" }}
                                                disabled={item.quantity === item.stock}
                                                onClick={() => handleIncrement(item.title)}>
                                                <AddIcon fontSize="inherit" />
                                            </IconButton>
                                        </Button>
                                    </ListItem>
                                </ListItem>
                            )
                        })}
                    </List>
                ) : (
                    <List sx={{ width: "250px" }}>
                        <ListItemText align="center">您的購物車內沒有任何商品</ListItemText>
                    </List>
                )}
                {orderList.length > 0 ? (
                    <Button component={RouterLink} to="/Checkout" onClick={() => setDrawerOpen(false)}>
                        前往結帳
                    </Button>
                ) : null}
            </Drawer>
        </Box>
    ) : null
}

export default ShoppingCart
