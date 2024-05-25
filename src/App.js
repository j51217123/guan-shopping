import React, { useEffect, Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import { compose } from 'redux'
import { useDispatch, useSelector } from "react-redux"
import productSlice from "./Redux/Product/ProductSlice"
import Checkout from "./Components/Checkout/Checkout"
import { Container, Skeleton, Box } from "@mui/material"
import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import ForgotPassword from "./Components/Common/ForgotPassword/ForgotPassword"
import ProductDetail from "./Components/ProductDetail/ProductDetail"
// import ProductCardList from "./Components/ProductCardList/ProductCardList"
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart"
import Dashboard from "./Components/Dashboard/Dashboard"
import AddProduct from "./Components/Dashboard/AddProduct"
import RemoveProduct from "./Components/Dashboard/RemoveProduct"
import EditProduct from "./Components/Dashboard/EditProduct"
import WithConfigProvider from './Components/App/withConfigProvider'
import withRedux from './Components/App/withRedux'

const {
    getProductsData,
} = productSlice.actions

const ProductCardList = lazy(() => import("./Components/ProductCardList/ProductCardList"))

const SkeletonLoader = () => (
    <Box>
        <Skeleton variant="rectangular" width="100%" height={118} style={{ marginBottom: 16 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
    </Box>
)


function App() {
    const dispatch = useDispatch()
    const productsData = useSelector(state => state.products.productsData)

    useEffect(() => {
        dispatch(getProductsData())

    }, [])

    // useEffect(() => {
    //     const initialProductList = async () => {
    //         const productsData = await getProductListFromFirestore()

    //         const imagesData = await getProductImagesFromStorage()
    //         const subImagesData = await getSubImagesFromStorage()
    //         console.log("🚀 - subImagesData:", subImagesData)
    //         const tempData = await Promise.all(
    //             productsData.map(async product => {
    //                 let data = []
    //                 const tabsImagesData = await getTabImagesFromStorage(product.title)
    //                 console.log("🚀 - tabsImagesData:", tabsImagesData)
    //                 product = {
    //                     ...product,
    //                     tabsImagesData,
    //                 }
    //                 data.push(product)
    //                 return data
    //             })
    //         )
    //         const newProductsData = tempData.flatMap(item => item)

    //         newProductsData.forEach(product => {
    //             const selectedImageIndex = imagesData.findIndex(image => decodeURIComponent(image).includes(product.title))
    //             const selectedSubImageIndex = subImagesData.findIndex(image =>
    //                 decodeURIComponent(image).includes(product.title)
    //             )
    //             let tempData = []
    //             if (selectedImageIndex !== -1) {
    //                 product.mainImg = imagesData[selectedImageIndex]
    //             }
    //             if (selectedSubImageIndex !== -1) {
    //                 tempData = [...tempData, subImagesData[selectedSubImageIndex]]
    //                 product.subImgList = tempData
    //             }
    //         })
    
    //         dispatch(setProductsData(newProductsData))
    //     }
    //     initialProductList()
    // }, [])


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
                            <Suspense fallback={ <Skeleton variant="rectangular" width="100%" height={118} style={{ marginBottom: 16 }} />}>
                                <ProductCardList />
                            </Suspense>
                            {/* <ProductCardList itemData={productsData} /> */}
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

// export default App

const EnhancedApp = compose(withRedux, WithConfigProvider)(App)
export default EnhancedApp