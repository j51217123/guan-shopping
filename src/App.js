import React, { useEffect, Suspense, lazy } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { compose } from "redux"
import { useDispatch, useSelector } from "react-redux"
import { Container } from "@mui/material"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import productSlice from "./Redux/Product/ProductSlice"
import userSlice from "./Redux/User/UserSlice"
import WithConfigProvider from "./Components/App/withConfigProvider"
import withRedux from "./Components/App/withRedux"
import Layout from "./Components/Common/Layout"
import LoadingMask from "./Components/Common/LoadingMask"
import RequireAuth from "./Components/Common/RequireAuth"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import Checkout from "./Components/Checkout/Checkout"
import ForgotPassword from "./Components/Common/ForgotPassword/ForgotPassword"
import ProductDetail from "./Components/ProductDetail/ProductDetail"
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart"
import Dashboard from "./Components/Dashboard/Dashboard"
import AddProduct from "./Components/Dashboard/AddProduct"
import RemoveProduct from "./Components/Dashboard/RemoveProduct"
import EditProduct from "./Components/Dashboard/EditProduct"
import PaymentResult from "./Components/PaymentResult/PaymentResult"
import { setNavigate } from "./Utils/UtilityJS"

const { getProductsData } = productSlice.actions
const { authStateChanged } = userSlice.actions

const ProductCardList = lazy(() => import("./Components/ProductCardList/ProductCardList"))

function App() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const productsData = useSelector(state => state.products.productsData)
    const isLogin = useSelector(state => state.user.isLogin)

    useEffect(() => {
        dispatch(getProductsData())
    }, [])

    useEffect(() => {
        setNavigate(navigate)
    }, [navigate])

    // 訂閱 Firebase 登入狀態，取代原本靠 localStorage 判斷（可被 DevTools 偽造）
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => {
            dispatch(
                authStateChanged(
                    user ? { email: user.email, uid: user.uid } : null
                )
            )
        })
        return unsubscribe
    }, [dispatch])

    return (
        <>
            <LoadingMask />
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
                                        xs: '100%',
                                        sm: '95%',
                                        md: '90%',
                                        lg: '85%',
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/shopping-cart" element={<ShoppingCart />} />
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }>
                        <Route path="/dashboard/add-product" element={<AddProduct />} />
                        <Route path="/dashboard/remove-product" element={<RemoveProduct />} />
                        <Route path="/dashboard/edit-product" element={<EditProduct />} />
                    </Route>

                    {productsData?.map(item => {
                        return (
                            <Route
                                key={item.title}
                                path={`products/${item.title}`}
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
