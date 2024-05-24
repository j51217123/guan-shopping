import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Alert, Button, Snackbar, Box, Typography, TextField, Container } from "@mui/material"
import { ResetPassword } from "../../../Utils/firebase"

const theme = createTheme()

const ForgotPassword = () => {
    const [isShowLoginDialog, setIsShowLoginDialog] = useState(false)
    const [isSendEmailSuccess, setIsSendEmailSuccess] = useState(false)

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
        console.log("🚀 - file: ForgotPassword.tsx:8 - handleResetPassword - email", email)
        const result = await ResetPassword(email)

        if (result === "Firebase: Error (auth/user-not-found).") {
            setIsShowLoginDialog(true)
            setIsSendEmailSuccess(false)
        } else {
            console.log("result: ", result)
            setIsShowLoginDialog(true)
            setIsSendEmailSuccess(true)
        }
    }

    const handleClose = () => {
        setIsShowLoginDialog(false)
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
                    <Snackbar
                        open={isShowLoginDialog}
                        onClose={handleClose}
                        autoHideDuration={2000}
                        sx={{ position: "inherit", marginTop: "10px" }}>
                        <Alert sx={{ fontWeight: "bold" }} severity={isSendEmailSuccess ? "success" : "error"}>
                            {isSendEmailSuccess ? "認證信件發送成功 !" : "認證信件發送失敗 !"}
                        </Alert>
                    </Snackbar>
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
