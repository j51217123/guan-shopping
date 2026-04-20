import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loadingCount: 0,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        showLoading(state) {
            state.loadingCount += 1
        },
        hideLoading(state) {
            state.loadingCount = Math.max(0, state.loadingCount - 1)
        },
        resetLoading(state) {
            state.loadingCount = 0
        },
    },
})

export default uiSlice
