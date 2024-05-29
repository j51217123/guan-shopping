import * as React from "react"
import { useSelector, useDispatch } from "react-redux"
import {
    Box,
    Button,
    Typography,
    IconButton,
    Container,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table,
} from "@mui/material"
import { Delete as DeleteIcon, Remove as RemoveIcon, Add as AddIcon } from "@mui/icons-material"
import productSlice from "../../Redux/Product/ProductSlice"

const { setIncrement, setDecrement, setRemove } = productSlice.actions

function priceRow(qty, unit) {
    return qty * unit
}

function subtotal(items) {
    return items.map(({ discountPrice, quantity }) => quantity * discountPrice).reduce((sum, i) => sum + i, 0)
}

const Checkout = () => {
    const dispatch = useDispatch()
    const orderList = useSelector(state => state.products.orderList)
    const invoiceSubtotal = subtotal(orderList)

    const handleIncrement = title => dispatch(setIncrement(title))

    const handleDecrement = title => dispatch(setDecrement(title))

    const handleRemove = ({ productId }) => dispatch(setRemove({ productId }))

    return (
        <TableContainer component={Container} sx={{ minHeight: 600, mt: 3, overflow: "hidden" }}>
            <Table sx={{ height: "100%" }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{ fontWeight: "bold", fontSize: "30px", border: `${orderList.length === 0 && "none"}` }}
                            align="left"
                            colSpan={5}>
                            Shopping Cart
                        </TableCell>
                    </TableRow>
                    {orderList.length > 0 ? (
                        <React.Fragment>
                            <TableRow>
                                <TableCell>商品</TableCell>
                                <TableCell sx={{ pr: 3.5 }} align="right">
                                    數量
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        padding: {
                                            xs: "12px",
                                            md: "12px",
                                        },
                                    }}>
                                    單價
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        padding: {
                                            xs: "12px",
                                            md: "12px",
                                        },
                                    }}>
                                    金額
                                </TableCell>
                                <TableCell align="right" />
                            </TableRow>
                        </React.Fragment>
                    ) : null}
                </TableHead>
                <TableBody>
                    {orderList.length > 0 ? (
                        <React.Fragment>
                            {console.log(orderList)}
                            {orderList.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell sx={{ pl: 0, pr: 0, whiteSpace: "nowrap" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: {
                                                    xs: 1.5,
                                                    sm: 2,
                                                    md: 3,
                                                    lg: 3,
                                                },
                                            }}>
                                            <Box
                                                component="img"
                                                src={item.mainImg}
                                                sx={{
                                                    objectFit: "contain",
                                                    maxWidth: {
                                                        xs: "60px",
                                                        md: "80px",
                                                        lg: "80px",
                                                    },
                                                    maxHeight: {
                                                        xs: "60px",
                                                        md: "80px",
                                                        lg: "80px",
                                                    },
                                                }}
                                            />
                                            <Box>
                                                <Typography component="p" variant="button" sx={{ fontWeight: "bold" }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography>{item.desc}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ padding: "10px" }}>
                                        <Button
                                            variant="outlined"
                                            component="div"
                                            sx={{
                                                padding: 0,
                                                borderRadius: "40px",
                                                backgroundColor: "white",
                                                borderColor: "#e0e0e0",
                                                maxWidth: {
                                                    xs: "60px",
                                                    md: "80px",
                                                    lg: "80px",
                                                },
                                                maxHeight: {
                                                    xs: "30px",
                                                    md: "40px",
                                                    lg: "40px",
                                                },
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
                                    </TableCell>
                                    <TableCell align="right">{item.discountPrice}</TableCell>
                                    <TableCell align="right" sx={{ pl: 0, minWidth: "65px" }}>
                                        {priceRow(item.quantity, item.discountPrice)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ paddingLeft: "5px" }}>
                                        <IconButton
                                            aria-label="delete"
                                            sx={{ width: "16px", height: "16px" }}
                                            onClick={() => {
                                                const { productId } = item
                                                handleRemove({ productId })
                                            }}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={2} sx={{ border: "none" }} />
                                <TableCell colSpan={1} sx={{ whiteSpace: "nowrap" }}>
                                    總額
                                </TableCell>
                                <TableCell colSpan={1} align="right">
                                    {invoiceSubtotal}
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={1} align="center" sx={{ fontSize: "30px", border: "none" }}>
                                您的購物車目前沒有任何商品
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Checkout
