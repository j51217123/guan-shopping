import React from "react"
import Box from "@mui/material/Box"
import ProductCardList from "../ProductCardList/ProductCardList"
import MainBannerSlider from "../MainBannerSlider/MainBannerSlider"

const Contents = ({ itemData }) => {
    return (
        <Box component="section" sx={{ mt: 2 }}>
            <MainBannerSlider />
            <ProductCardList itemData={itemData} />
        </Box>
    )
}

export default Contents
