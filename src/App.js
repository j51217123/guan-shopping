import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setProductsData } from "./Redux/Store/productSlice"
import {
    getProductListFromFirestore,
    getProductImagesFromStorage,
    getSubImagesFromStorage,
    getTabImagesFromStorage,
} from "./Utils/firebase"
import Checkout from "./Components/Checkout/Checkout"
import Container from "@mui/material/Container"
import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import ForgotPassword from "./Components/Common/ForgotPassword/ForgotPassword"
import ProductDetail from "./Components/ProductDetail/ProductDetail"
import ProductCardList from "./Components/ProductCardList/ProductCardList"
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart"
import Dashboard from "./Components/Dashboard/Dashboard"
import AddProduct from "./Components/Dashboard/AddProduct"
import RemoveProduct from "./Components/Dashboard/RemoveProduct"
import EditProduct from "./Components/Dashboard/EditProduct"

function App() {
    const dispatch = useDispatch()
    const productsData = useSelector(state => state.products.productsData)

    useEffect(() => {
        initialProductList()
    }, [])

    const initialProductList = async () => {
        const productsData = await getProductListFromFirestore()
        const imagesData = await getProductImagesFromStorage()
        const subImagesData = await getSubImagesFromStorage()
        const tempData = await Promise.all(
            productsData.map(async product => {
                let data = []
                const tabsImagesData = await getTabImagesFromStorage(product.title)
                product = {
                    ...product,
                    tabsImagesData,
                }
                data.push(product)
                return data
            })
        )
        const newProductsData = tempData.flatMap(item => item)

        newProductsData.forEach(product => {
            const selectedImageIndex = imagesData.findIndex(image => decodeURIComponent(image).includes(product.title))
            const selectedSubImageIndex = subImagesData.findIndex(image =>
                decodeURIComponent(image).includes(product.title)
            )
            let tempData = []
            if (selectedImageIndex !== -1) {
                product.mainImg = imagesData[selectedImageIndex]
            }
            if (selectedSubImageIndex !== -1) {
                tempData = [...tempData, subImagesData[selectedSubImageIndex]]
                product.subImgList = tempData
            }
        })

        dispatch(setProductsData(newProductsData))
    }

    return (
        <>
            <Header />
            <ShoppingCart />
            <Routes>
                <Route path="/" element={<Home itemData={productsData} />} />
                <Route
                    path="/products"
                    element={
                        <Container
                            component="section"
                            sx={{
                                minHeight: {
                                    xs: "calc( 100vh - 68.5px - 140px )",
                                    md: "calc( 100vh - 68.5px - 150px )",
                                    lg: "calc( 100vh - 68.5px - 150px )",
                                },
                                paddingBottom: "24px",
                            }}>
                            <ProductCardList itemData={productsData} />
                        </Container>
                    }
                />
                <Route path="/Login" element={<Login />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/Checkout" element={<Checkout />} />
                <Route path="/ShoppingCart" element={<ShoppingCart />} />
                <Route path="/Dashboard" element={<Dashboard />}>
                    <Route path="/Dashboard/addProduct" element={<AddProduct />} />
                    <Route path="/Dashboard/removeProduct" element={<RemoveProduct />} />
                    <Route path="/Dashboard/editProduct" element={<EditProduct />} />
                </Route>

                {productsData?.map(item => {
                    return (
                        <Route
                            key={item.title}
                            path={`ProductDetail/${item.title}`}
                            element={<ProductDetail itemData={item} />}
                        />
                    )
                })}
            </Routes>
            <Footer />
        </>
    )
}

export default App
