import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Link as RouteLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import CheckIcon from "@mui/icons-material/Check"
import {
    Alert,
    Container,
    Typography,
    Box,
    Grid,
    Checkbox,
    FormControlLabel,
    TextField,
    Button,
    Avatar,
    Snackbar,
} from "@mui/material"
import { setLogin } from "../../Redux/Store/userSlice"
import { handleLoginWithGoogle, handleLoginOrRegister } from "../../Utils/firebase"
import GoogleIcon from "../../Assets/Images/google-icon.svg"
import Logo from "../../Assets/Images/logo-2.png"

const theme = createTheme()

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isShowLoginDialog, setIsShowLoginDialog] = useState(false)

    const validationRules = {
        email: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "錯誤的信箱格式",
        },
        password: {
            value: /^.{6,}$/,
            message: "密碼至少為六碼",
        },
        confirmPassword: {
            message: "密碼匹配不一致",
        },
    }

    const defaultValues = {
        email: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
    }

    const {
        watch,
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm(defaultValues)

    const onSubmit = async data => {
        const { email, password } = data
        await handleLoginOrRegister(email, password).then(res => {
            setUserInfoToRedux(res)
            setIsShowLoginDialog(true)
            redirectToHome()
        })
    }

    const setUserInfoToRedux = data => {
        const {
            user: { email, uid },
        } = data

        dispatch(
            setLogin({
                uid: uid,
                email: email,
                login: true,
            })
        )
    }

    const redirectToHome = () => {
        setTimeout(() => {
            navigate("/")
        }, 2000)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    marginBottom: "30px",
                    minHeight: {
                        xs: "calc( 100vh - 68.5px - 149px )",
                        md: "calc( 100vh - 68.5px - 160px )",
                        lg: "calc( 100vh - 68.5px - 160px )",
                    },
                }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: "5%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Avatar sx={{ m: 1 }} src={Logo} />
                    <Typography component="h1" variant="h5">
                        註冊/登入
                    </Typography>
                    <Snackbar
                        open={isShowLoginDialog}
                        autoHideDuration={2000}
                        sx={{ position: "inherit", marginTop: "10px" }}>
                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            登入/註冊成功!
                        </Alert>
                    </Snackbar>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
                        <TextField
                            required
                            fullWidth
                            id="password"
                            type="password"
                            label="Password"
                            margin="normal"
                            autoComplete="current-password"
                            error={!!errors?.password}
                            helperText={errors?.password ? `${errors.password.message}` : null}
                            {...register("password", { required: "密碼不得為空", pattern: validationRules.password })}
                        />
                        <TextField
                            required
                            fullWidth
                            id="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            autoComplete="current-password"
                            margin="normal"
                            error={!!errors?.confirmPassword}
                            helperText={errors?.confirmPassword ? `${errors.confirmPassword.message}` : null}
                            {...register("confirmPassword", {
                                required: "確認密碼不得為空",
                                validate: value => {
                                    return value === watch("password") || validationRules.confirmPassword.message
                                },
                            })}
                        />
                        <FormControlLabel
                            control={
                                <Controller name="記住我" control={control} render={() => <Checkbox id="記住我" />} />
                            }
                            label="記住我"
                            aria-labelledby="記住我"
                        />
                        <Button type="submit" fullWidth variant="contained">
                            註冊 / 登入
                        </Button>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                border: "1px solid rgba(0, 0, 0, 0.15)",
                                borderRadius: "4px",
                                padding: "5px 0",
                                marginTop: "16px",
                                marginBottom: "8px",
                            }}>
                            <Box component="img" src={GoogleIcon} alt="Google" sx={{ width: "18px", height: "18px" }} />
                            <Button
                                sx={{ color: "black" }}
                                onClick={() => {
                                    handleLoginWithGoogle()
                                }}>
                                Google 註冊 / 登入
                            </Button>
                        </Box>
                        <Grid container>
                            <Grid item xs>
                                <Typography
                                    component={RouteLink}
                                    sx={{ textDecoration: "none", color: "inherit" }}
                                    to="/ForgotPassword">
                                    忘記密碼?
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Login
