import React, { useState } from "react"
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

const IMAGE_HEIGHT = 140

const ProductCard = ({ handleAddToCart, imageUrl, title, alt, desc }) => {
    const hasData = Boolean(title)
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <>
            {!hasData ? (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 2px 6px 0 rgb(0 0 0 / 6%)",
                        borderRadius: 1,
                        overflow: "hidden",
                    }}>
                    <Skeleton variant="rectangular" animation="wave" height={IMAGE_HEIGHT} />
                    <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Skeleton variant="text" animation="wave" sx={{ fontSize: "1.5rem" }} width="60%" />
                        <Skeleton variant="text" animation="wave" />
                        <Skeleton variant="text" animation="wave" />
                        <Skeleton variant="text" animation="wave" width="80%" />
                    </Box>
                    <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                        <Skeleton variant="rectangular" animation="wave" width={80} height={32} />
                    </Box>
                </Box>
            ) : (
                <Card
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 2px 6px 0 rgb(0 0 0 / 6%)",
                        textAlign: "center",
                    }}>
                    <CardActionArea sx={{ flexGrow: 1 }}>
                        <Box
                            component={RouterLink}
                            to={`/products/${title}`}
                            sx={{
                                textDecoration: "none",
                                color: "#000",
                            }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    height: IMAGE_HEIGHT,
                                    width: "100%",
                                    overflow: "hidden",
                                }}>
                                {!imageLoaded && (
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        sx={{ position: "absolute", inset: 0 }}
                                    />
                                )}
                                <CardMedia
                                    component="img"
                                    image={imageUrl}
                                    alt={alt}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageLoaded(true)}
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        padding: "15px",
                                        boxSizing: "border-box",
                                        opacity: imageLoaded ? 1 : 0,
                                        transition: "opacity 0.3s ease-in-out",
                                    }}
                                />
                            </Box>
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