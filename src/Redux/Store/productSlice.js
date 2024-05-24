import { createSlice, current } from "@reduxjs/toolkit"

const initialState = {
    productsData: [],
    orderList: [],
}

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // reducers : function 資料管理的操作方法
        setProductsData: (state, action) => {
            state.productsData = action.payload // key ( state.productsData):value (action.payload)
        },

        setOrderList: (state, action) => {
            console.log(action.payload, "setOrderList action.payload")
            const { productId } = action.payload
            const selectedItemIndex = state.orderList.findIndex(item => item.productId === productId)
            if (selectedItemIndex === -1) {
                state.orderList = [...state.orderList, action.payload]
            } else {
                state.orderList[selectedItemIndex] = {
                    ...state.orderList[selectedItemIndex],
                    quantity: action.payload.quantity
                }
            }
        },

        setIncrement: (state, action) => {
            const { productId } = action.payload
            console.log(action.payload,'action.payload');
            state.orderList.forEach(item => {
                if (item.productId === productId) return (item.quantity += 1)
            })
        },

        setDecrement: (state, action) => {
            const { productId } = action.payload
            state.orderList.forEach(item => {
                if (item.productId === productId) return (item.quantity -= 1)
            })
        },

        setRemove: (state, action) => {
            const { productId } = action.payload
            const selectedItemIndex = state.orderList.findIndex(item => item.productId === productId)
            state.orderList.splice(selectedItemIndex, 1)
        },
    },
})

// Action creators are generated for each case reducer function
export const { setProductsData, setOrderList, setIncrement, setDecrement, setRemove } = productSlice.actions

export default productSlice.reducer
