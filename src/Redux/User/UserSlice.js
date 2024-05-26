import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    profile: {},
    userLoading: false,
    isLogin: false,
    error: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        registerRequest(state) {
            state.userLoading = true
        },
        registerSuccess(state, action) {
            state.profile = action.payload
            state.userLoading = false
            state.isLogin = true
        },
        registerFailure(state, action) {
            state.userLoading = false
            state.error = action.payload
        },
        loginRequest(state, action) {
            state.userLoading = true
        },
        loginSuccess(state, action) {
            state.profile = action.payload
            state.userLoading = false
            state.isLogin = true
        },
        loginFailure(state, action) {
            state.userLoading = false
            state.error = action.payload
        },
        loginWithGoogle(state, action) {
            state.userLoading = true
        },
        logoutRequest(state, action) {
            state.userLoading = true
        },
        logoutSuccess(state, action) {
            state.profile = {}
            state.userLoading = false
            state.isLogin = false
        },
        logoutFailure(state, action) {
            state.userLoading = false
            state.error = action.payload
        },
    },
})

export default userSlice