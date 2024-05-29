import React from "react"
import { useForm } from "react-hook-form"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useDispatch } from "react-redux"
import CssBaseline from "@mui/material/CssBaseline"
import { Button, Box, Typography, TextField, Container } from "@mui/material"
import userSlice from "../../../Redux/User/UserSlice"

const { resetPassword } = userSlice.actions
const theme = createTheme()

const ForgotPassword = () => {
    const dispatch = useDispatch()

    const validationRules = {
        email: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "錯誤的信箱格式",
        },
    }

    const defaultValues = {
        email: "",
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(defaultValues)

    const handleResetPassword = async data => {
        const { email } = data
        dispatch(resetPassword(email))
    }

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    marginBottom: "30px",
                    minHeight: {
                        xs: "calc( 100vh - 68.5px - 160px )",
                        md: "calc( 100vh - 68.5px - 180px )",
                        lg: "calc( 100vh - 68.5px - 180px )",
                    },
                }}>
                <CssBaseline />
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(handleResetPassword)}
                    sx={{
                        marginTop: "10%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Typography component="h1" variant="h5">
                        忘記密碼
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <TextField
                            required
                            fullWidth
                            autoFocus
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            margin="normal"
                            error={!!errors?.email}
                            helperText={errors?.email ? `${errors.email.message}` : null}
                            {...register("email", {
                                required: "信箱不得為空",
                                pattern: validationRules.email,
                            })}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                            發送認證信件
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default ForgotPassword
