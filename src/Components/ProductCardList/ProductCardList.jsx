import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography } from "@mui/material"
import ProductCard from "../ProductCard/ProductCard"
import productSlice from "../../Redux/Product/ProductSlice"

const { setOrderList } = productSlice.actions

const ProductCardList = () => {
    const dispatch = useDispatch()
    const productsData = useSelector(state => state.products.productsData)

    const handleAddToCart = item => {
        let orderInfo = {
            title: item.title,
            productId: item.productId,
            mainImg: item.mainImg,
            quantity: item.quantity,
            stock: item.stock,
            discountPrice: item.discountPrice,
        }
        dispatch(setOrderList(orderInfo))
    }

    return (
        <Box mt={5} p={1} sx={{ gap: "20px" }}>
            <Typography
                display="inline-block"
                component="span"
                align="center"
                variant="h4"
                mb={2}
                sx={{ width: "100%", fontWeight: "bold" }}>
                精選商品
            </Typography>
            <Box
                display="flex"
                sx={{
                    gap: "15px",
                    width: "100%",
                    flexWrap: 'wrap'
                }}>
                {productsData?.map(card => {
                    return (
                        <ProductCard
                            key={card.title}
                            imageUrl={card.mainImg}
                            title={card.title}
                            alt={card.title}
                            desc={card.desc}
                            handleAddToCart={() => {
                                handleAddToCart(card)
                            }}
                        />
                    )
                })}
            </Box>
        </Box>
    )
}

export default ProductCardList
