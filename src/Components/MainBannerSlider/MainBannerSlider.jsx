import React, { useState } from "react"
import { useSelector } from "react-redux"
import Slider from "react-slick"
import { Box, Skeleton } from "@mui/material"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "./MainBannerSlider.css"
import Banner1 from "../../Assets/Images/banner.jpg"

const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
}

const sliderImageList = [
    {
        name: "組合優惠",
        url: Banner1,
        desc: "鍋物好選擇，一醬多用，方便快捷，懶人料理，正宗大陸老川味道",
    },
]

// banner 維持比例 1280 × 400 的佔位高度（實際尺寸以載入後為準）
const BANNER_ASPECT_PADDING = "31.25%" // 400/1280

const MainBannerSlider = () => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const productsReady = useSelector(state => state.products.productsData?.length > 0)
    // 圖片已載入 + products 資料到齊才顯示，讓上下區塊一起 reveal
    const ready = imageLoaded && productsReady

    return (
        <Box mt={1} p={1} sx={{ position: "relative" }}>
            {!ready && (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                        width: "100%",
                        maxWidth: "1280px",
                        paddingTop: BANNER_ASPECT_PADDING,
                        mx: "auto",
                    }}
                />
            )}
            <Box sx={{ display: ready ? "block" : "none" }}>
                <Slider {...settings}>
                    {sliderImageList.map((img, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={img.url}
                            alt={img.name}
                            loading="eager"
                            fetchpriority="high"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(true)}
                            sx={{ maxWidth: "1280px" }}
                        />
                    ))}
                </Slider>
            </Box>
        </Box>
    )
}

export default MainBannerSlider
