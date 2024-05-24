import React from "react"
import { useDispatch } from "react-redux"
import { Box, Typography } from "@mui/material"
import ProductCard from "../ProductCard/ProductCard"
import { setOrderList } from "../../Redux/Store/productSlice"

const ProductCardList = ({ itemData }) => {
    const dispatch = useDispatch()
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
        <Box display="flex" flexWrap="wrap" justifyContent="center" mt={5} p={1} sx={{ gap: "20px" }}>
            <Typography component="span" variant="h4" sx={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>
                精選商品
            </Typography>
            <Box display="flex" flexWrap="wrap" sx={{ gap: "15px" }}>
                {itemData.map(card => {
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
