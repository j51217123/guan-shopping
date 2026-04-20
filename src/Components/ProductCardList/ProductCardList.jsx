import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid, Typography } from "@mui/material"
import ProductCard from "../ProductCard/ProductCard"
import productSlice from "../../Redux/Product/ProductSlice"

const { setOrderList } = productSlice.actions

// 資料未到時顯示的骨架佔位數量，避免 footer 被推下造成 CLS
const PLACEHOLDER_COUNT = 4

const ProductCardList = () => {
    const dispatch = useDispatch()
    const productsData = useSelector(state => state.products.productsData)

    const handleAddToCart = item => {
        const orderInfo = {
            title: item.title,
            productId: item.productId,
            mainImg: item.mainImg,
            quantity: item.quantity,
            stock: item.stock,
            discountPrice: item.discountPrice,
        }
        dispatch(setOrderList(orderInfo))
    }

    const hasData = productsData?.length > 0
    const items = hasData
        ? productsData
        : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({ placeholderKey: `sk-${i}` }))

    return (
        <Box mt={5} p={1}>
            <Typography
                align="center"
                variant="h4"
                mb={3}
                sx={{ fontWeight: "bold" }}>
                精選商品
            </Typography>
            <Grid container spacing={2}>
                {items.map(card => (
                    <Grid item key={card.title || card.placeholderKey} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard
                            imageUrl={card.mainImg}
                            title={card.title}
                            alt={card.title}
                            desc={card.desc}
                            handleAddToCart={() => handleAddToCart(card)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default ProductCardList
