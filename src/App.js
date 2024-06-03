import React, { useEffect, Suspense, lazy } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { compose } from "redux"
import { useDispatch, useSelector } from "react-redux"
import { Container } from "@mui/material"
import productSlice from "./Redux/Product/ProductSlice"
import Checkout from "./Components/Checkout/Checkout"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import ForgotPassword from "./Components/Common/ForgotPassword/ForgotPassword"
import ProductDetail from "./Components/ProductDetail/ProductDetail"
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart"
import Dashboard from "./Components/Dashboard/Dashboard"
import AddProduct from "./Components/Dashboard/AddProduct"
import RemoveProduct from "./Components/Dashboard/RemoveProduct"
import EditProduct from "./Components/Dashboard/EditProduct"
import WithConfigProvider from "./Components/App/withConfigProvider"
import withRedux from "./Components/App/withRedux"
import { setNavigate } from "./Utils/UtilityJS"
import Layout from "./Components/Common/Layout"
import PaymentResult from "./Components/PaymentResult/PaymentResult"

const { getProductsData } = productSlice.actions

const ProductCardList = lazy(() => import("./Components/ProductCardList/ProductCardList"))

function App() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const productsData = useSelector(state => state.products.productsData)
    const isLogin = localStorage.getItem("isMember") === "true" ? true : false

    useEffect(() => {
        dispatch(getProductsData())
    }, [])

    useEffect(() => {
        setNavigate(navigate)
    }, [navigate])

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout isLogin={isLogin} />}>
                    <Route path="/" element={<Home itemData={productsData} />} />
                    <Route path="/payment-result" element={<PaymentResult />} />
                    <Route
                        path="/products"
                        element={
                            <Container
                                component="section"
                                maxWidth="lg"
                                sx={{
                                    width: {
                                        xs: '100%', // 小屏幕
                                        sm: '80%', // 中等屏幕
                                        md: '60%', // 大屏幕
                                    },
                                    minHeight: {
                                        xs: "calc( 100vh - 68.5px - 140px )",
                                        md: "calc( 100vh - 68.5px - 150px )",
                                        lg: "calc( 100vh - 68.5px - 150px )",
                                    },
                                    paddingBottom: "24px",
                                }}>
                                    <Suspense fallback={<div>Loading....</div>}>
                                        <ProductCardList itemData={productsData} />
                                    </Suspense>
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
                </Route>
            </Routes>
        </>
    )
}

const EnhancedApp = compose(withRedux, WithConfigProvider)(App)
export default EnhancedApp
