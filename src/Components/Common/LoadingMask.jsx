import { useSelector } from "react-redux"
import { Backdrop, CircularProgress } from "@mui/material"

const LoadingMask = () => {
    const loadingCount = useSelector(state => state.ui.loadingCount)

    return (
        <Backdrop
            open={loadingCount > 0}
            sx={{
                color: "#fff",
                zIndex: theme => theme.zIndex.modal + 1,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default LoadingMask
