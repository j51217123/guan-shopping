import React from "react"
import Slider from "react-slick"
import Box from "@mui/material/Box"
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

const MainBannerSlider = () => {
    return (
        <Box mt={1} p={1}>
            <Slider {...settings}>
                {sliderImageList.map((img, index) => {
                    return <Box component="img" key={index} src={img.url} alt={img.name} sx={{ maxWidth: "1280px" }} />
                })}
            </Slider>
        </Box>
    )
}

export default MainBannerSlider
