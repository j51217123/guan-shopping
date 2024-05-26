import React, { useEffect, Suspense, lazy } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
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
import { setNavigate } from './Utils/UtilityJS'

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
    const navigate = useNavigate()
    const productsData = useSelector(state => state.products.productsData)

    useEffect(() => {
        dispatch(getProductsData())
    }, [])

    useEffect(() => {
        setNavigate(navigate)
    }, [navigate])

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