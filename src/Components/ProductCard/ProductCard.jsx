import React from "react"
import { useSelector } from "react-redux"
import { styled } from "@mui/material/styles"
import { Link as RouterLink } from "react-router-dom"
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Skeleton,
} from "@mui/material"

const ProductCard = ({ handleAddToCart, imageUrl, title, alt, desc }) => {
    const productLoading = useSelector(state => state.products.productLoading)

    return (
        <>
            {productLoading ? (
                <Box
                    sx={{
                        width: {
                            xs: "97%",
                            sm: "97%",
                            md: "45%",
                            lg: "97%",
                        },
                        maxWidth: { xs: "97%", md: "47%", lg: "260px" },
                    }}>
                    <Skeleton variant="rectangular" height={140} />
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="rectangular" height={46} />
                </Box>
            ) : (
                <Card
                    sx={{
                        maxWidth: { xs: "97%", md: "47%", lg: "23%" },
                        width: "auto",
                        boxShadow: "0 2px 6px 0 rgb(0 0 0 / 6%)",
                        textAlign: "center",
                        minWidth: { xs: "97%", md: "47%", lg: "260px" },
                    }}>
                    <CardActionArea>
                        <Box
                            component={RouterLink}
                            to={`/ProductDetail/${title}`}
                            sx={{
                                textDecoration: "none",
                                color: "#000",
                            }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={imageUrl}
                                alt={alt}
                                sx={{ objectFit: "contain", padding: "15px", display: "block", width: "100%" }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                                    {title}
                                </Typography>
                                <ProductDescription sx={{ minHeight: "60px" }} variant="body2" color="text.secondary">
                                    {desc}
                                </ProductDescription>
                            </CardContent>
                        </Box>
                    </CardActionArea>
                    <CardActions sx={{ justifyContent: "right" }}>
                        <Button size="small" color="primary" onClick={handleAddToCart}>
                            <Typography variant="inherit" component="span">
                                加入購物車
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            )}
        </>
    )
}

const ProductDescription = styled(Typography)`
    max-height: 80px;
    overflow: hidden;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
`

export default ProductCard