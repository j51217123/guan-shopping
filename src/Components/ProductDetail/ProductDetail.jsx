import React, { useState } from "react"
import { useDispatch } from "react-redux"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { Button, ImageListItem, ImageList, Typography, Box, Container } from "@mui/material"
import TabPanel from "../TabPanel/TabPanel"
import productSlice from "../../Redux/Product/ProductSlice"
import "./ProductDetail.css"

const { setOrderList } = productSlice.actions

const ProductDetail = ({
    itemData: {
        productId,
        quantity,
        stock,
        tabsImagesData,
        mainImg,
        subImgList,
        title,
        desc,
        tabDesc,
        deliveryDesc,
        originalPrice,
        discountPrice,
    },
}) => {
    const dispatch = useDispatch()
    const [itemQuantity, setItemQuantity] = useState(quantity)
    const [mainImage, setMainImage] = useState(mainImg)

    const handleIncrement = () => {
        setItemQuantity(itemQuantity + 1)
    }

    const handleDecrement = () => {
        setItemQuantity(itemQuantity - 1)
    }

    const handleAddToCart = () => {
        let orderInfo = {
            title,
            productId,
            mainImg,
            quantity: itemQuantity,
            stock,
            discountPrice,
        }
        dispatch(setOrderList(orderInfo))
    }

    const handleMouseEnter = (image, index) => {
        setMainImage(image)
    }

    const handleMouseOut = () => {
        setMainImage(mainImg)
    }

    return (
        <>
            <Container
                component="section"
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    justifyContent: "center",
                    alignItems: {
                        xs: "center",
                        md: "flex-start",
                        lg: "flex-start",
                    },
                    padding: "24px",
                    gap: "10px",
                }}>
                <Box>
                    <Box
                        component="img"
                        src={mainImage}
                        alt=""
                        loading="lazy"
                        width="300px"
                        height="300px"
                        sx={{ objectFit: "contain" }}
                    />
                    <ImageList sx={{ width: 290, overflowY: "unset", margin: 1 }} cols={4} rowHeight={60}>
                        {subImgList?.map((image, index) => {
                            return (
                                <ImageListItem key={index}>
                                    <Box
                                        sx={{
                                            height: 60,
                                            objectFit: "contain",
                                        }}
                                        component="img"
                                        src={image}
                                        alt={title}
                                        loading="lazy"
                                        onMouseEnter={() => {
                                            handleMouseEnter(image)
                                        }}
                                        onMouseOut={handleMouseOut}
                                    />
                                </ImageListItem>
                            )
                        })}
                    </ImageList>
                </Box>
                <Box sx={{ padding: "8px 12px" }}>
                    <Box
                        className="ovis"
                        sx={{
                            minWidth: {
                                xs: "300px",
                                lg: "600px",
                            },
                        }}>
                        <Typography gutterBottom variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                            {title}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                            {desc}
                        </Typography>
                    </Box>
                    <hr />
                    <Box
                        sx={{
                            width: {
                                md: "100%",
                                lg: "50%",
                            },
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                            marginTop: "20px",
                        }}>
                        <Box
                            className="price-box"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                fontSize: "14px",
                                backgroundColor: "#f3f3f3",
                            }}>
                            <Box sx={{ textDecoration: "line-through", color: "#888", padding: "12px 12px 8px" }}>
                                原價 ${originalPrice}
                            </Box>
                            <Box
                                sx={{
                                    color: "#d44211",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    padding: "8px 12px 12px",
                                }}>
                                <Typography component="span" sx={{ fontSize: "14px", marginRight: "5px" }}>
                                    優惠價
                                </Typography>
                                ${discountPrice}
                            </Box>
                        </Box>
                        <Box
                            className="quantity-box"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f3f3f3",
                                padding: "8px 12px 12px",
                            }}>
                            <Typography component="span">數量</Typography>
                            <Box sx={{ display: "inline-block" }}>
                                <Button
                                    disabled={itemQuantity === 1 ? true : false}
                                    onClick={() => {
                                        handleDecrement({ itemQuantity, productId })
                                    }}>
                                    -
                                </Button>
                                <Typography component="span">{itemQuantity}</Typography>
                                <Button
                                    disabled={itemQuantity === stock ? true : false}
                                    onClick={() => {
                                        handleIncrement({ itemQuantity, productId })
                                    }}>
                                    +
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: "8px" }}>
                            <Button fullWidth={true} variant="contained">
                                立即結帳
                            </Button>
                            <Button
                                fullWidth={true}
                                variant="outlined"
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}>
                                加入購物車
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Container
                component="section"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "24px",
                    gap: "10px",
                }}>
                <TabPanel tabDesc={tabDesc} deliveryDesc={deliveryDesc} tabsImagesData={tabsImagesData} />
            </Container>
        </>
    )
}

export default ProductDetail
