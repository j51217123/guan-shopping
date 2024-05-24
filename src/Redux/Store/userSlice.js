import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    profile: {
        uid: "",
        email: "",
        login: false,
    },
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLogin(state, action) {
            const { uid, email } = action.payload
            state.profile = {
                uid,
                email,
                login: true,
            }
        },
        setLogout(state) {
            state.profile = initialState.profile
        },
    },
})

export const { setLogin, setLogout } = userSlice.actions

export default userSlice.reducer
