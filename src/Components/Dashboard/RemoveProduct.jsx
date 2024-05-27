import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { confirmAlert } from "react-confirm-alert"
import { Box, Button, Typography, InputLabel, MenuItem, FormControl, Select, CircularProgress } from "@mui/material"
import {
    // setRemoveProductDataFromFirestore,
    setRemoveProductImageFromStorage,
    setRemoveProductTabImageFromStorage,
} from "../../Utils/firebase"
import productSlice from "../../Redux/Product/ProductSlice"
import "react-confirm-alert/src/react-confirm-alert.css"
import "./removeProduct.css"

const { getProductsData, setRemoveProductDataFromFirestore } = productSlice.actions

const RemoveProduct = () => {
    const [product, setProduct] = useState("")
    const productsData = useSelector(state => state.products.productsData)
    const productLoading = useSelector(state => state.products.productLoading)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProductsData())
    }, [])

    const handleChange = event => {
        setProduct(event.target.value)
    }

    const handleRemove = () => {
        const selectedProductIndex = productsData.findIndex(item => item.title === product)

        confirmAlert({
            title: `刪除商品`,
            message: `確定要刪除${product}?`,
            buttons: [
                {
                    label: "是",
                    onClick: () => {
                        // setRemoveProductImageFromStorage(productsData[selectedProductIndex].imageFileName)
                        // setRemoveProductTabImageFromStorage(product)
                        // setRemoveProductDataFromFirestore(product, () => {
                        //     alert("刪除商品成功!")
                        //     setTimeout(() => {
                        //         window.location.reload()
                        //     }, 500)
                        // })
                        dispatch(
                            setRemoveProductDataFromFirestore({
                                productName: product,
                                imageFileName: productsData[selectedProductIndex].imageFileName,
                            })
                        )
                    },
                },
                {
                    label: "否",
                },
            ],
        })
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "15px",
                minHeight: {
                    xs: "calc( 95vh - 68.5px - 128px - 108px )",
                    md: "calc( 95vh - 68.5px - 128px - 108px )",
                    lg: "calc( 95vh - 68.5px - 128px - 108px )",
                },
            }}>
                {
                    productLoading
                        ? <CircularProgress />
                        : (
                            <>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        color: "red",
                                        fontSize: {
                                            xs: "25px",
                                            md: "25px",
                                            lg: "35px",
                                        },
                                    }}>
                                    刪除商品前請先重整頁面讀取資料!
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 160 }}>
                                    <InputLabel id="remove-product">選擇刪除的商品</InputLabel>
                                    <Select
                                        labelId="remove-product"
                                        id="demo-simple-select-autowidth"
                                        value={product}
                                        onChange={handleChange}
                                        autoWidth
                                        label="選擇刪除的商品">
                                        {productsData.map(product => {
                                            return (
                                                <MenuItem key={product.title} value={product.title}>
                                                    {product.title}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </>
                        )
                }
                {
                    productLoading
                        ? null
                        : (
                            <Button variant="contained" onClick={handleRemove} disabled={product === ""} loading={productLoading}>
                                刪除商品
                            </Button>
                        )
                }
        </Box>
    )
}
export default RemoveProduct
