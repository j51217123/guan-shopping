import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
// import userSlice from "./Redux/User/UserSlice"
// import productSlice from "./Redux/Product/productSlice"
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline"
import App from "./App"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import { Container } from "@mui/material"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    // <React.StrictMode>
    <BrowserRouter>
            <Routes>
                <Route
                    path="/*"
                    element={
                        // <Provider store={store}>
                        <ScopedCssBaseline>
                            <App />
                        </ScopedCssBaseline>
                        // </Provider>
                    }
                />
            </Routes>
    </BrowserRouter>
    // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
