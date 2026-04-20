import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { Box, CircularProgress } from "@mui/material"

const RequireAuth = ({ children }) => {
    const { isLogin, authReady } = useSelector(state => state.user)
    const location = useLocation()

    // Firebase onAuthStateChanged 首次觸發前會有短暫未就緒狀態，避免誤判為未登入
    if (!authReady) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        )
    }

    if (!isLogin) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return children
}

export default RequireAuth
