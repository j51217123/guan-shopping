import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button, CardActionArea, CardActions, Card, CardContent, CardMedia, Typography, Box } from "@mui/material"

const ProductCard = ({ handleAddToCart, imageUrl, title, alt, desc }) => {
    return (
        <Card
            sx={{
                maxWidth: { xs: "97%", md: "47%", lg: "23%" },
                width: "auto",
                boxShadow: "0 2px 6px 0 rgb(0 0 0 / 6%)",
                textAlign: "center",
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
                        sx={{ objectFit: "contain", padding: "15px" }}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {desc}
                        </Typography>
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
    )
}

export default ProductCard
