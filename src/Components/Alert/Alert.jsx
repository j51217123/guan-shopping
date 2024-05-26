import React from "react"
import ReactDOM from "react-dom"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const showAlert = (
    message,
    severity = "success",
    anchorOrigin = {
        vertical: "top",
        horizontal: "center",
    },
    duration = 2000
) => {
    const div = document.createElement("div")
    document.body.appendChild(div)

    const handleClose = () => {
        ReactDOM.unmountComponentAtNode(div)
        document.body.removeChild(div)
    }

    ReactDOM.render(
        <Snackbar open={true} autoHideDuration={duration} anchorOrigin={anchorOrigin} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>,
        div
    )
}

export default showAlert
