import React, {useState,useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, Skeleton } from "@mui/material"
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
        <Box display="flex" flexWrap="wrap" justifyContent="center" mt={5} p={1} sx={{ gap: "20px" }}>
            <Typography component="span" variant="h4" sx={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>
                精選商品
            </Typography>
            <Box display="flex" flexWrap="wrap" sx={{ gap: "15px" }}>
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

const SkeletonLoader = () => (
    <Box>
        <Skeleton variant="rectangular" width="100%" height={118} style={{ marginBottom: 16 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
    </Box>
)

// const LazyProductCardListWithDelay = ({ itemData }) => {
//     const [isLoading, setIsLoading] = useState(true);
  
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 3000); // 模拟延迟 2 秒
  
//       return () => clearTimeout(timer);
//     }, []);
  
//     if (isLoading) {
//       return <SkeletonLoader />
//     }
  
//     return <ProductCardList itemData={itemData} />;
//   };

// export default LazyProductCardListWithDelay
export default ProductCardList
