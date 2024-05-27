import { createSlice, current } from "@reduxjs/toolkit"

const initialState = {
    productsData: [],
    imagesData: [],
    subImagesData: [],
    tabsImagesData: [],
    orderList: [],
    productLoading: false,
}

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProductsData: (state, action) => {
            const imageMap = new Map()
            const subImageMap = new Map()

            state.imagesData.forEach((image, index) => {
                const title = decodeURIComponent(image).match(/title-regex/)[0] // 假设用正则表达式提取标题
                imageMap.set(title, state.imagesData[index])
            })

            state.subImagesData.forEach((image, index) => {
                const title = decodeURIComponent(image).match(/title-regex/)[0] // 假设用正则表达式提取标题
                if (!subImageMap.has(title)) {
                    subImageMap.set(title, [])
                }
                subImageMap.get(title).push(state.subImagesData[index])
            })

            state.productsData.forEach(product => {
                const mainImg = imageMap.get(product.title)
                if (mainImg) {
                    product.mainImg = mainImg
                }

                const subImgList = subImageMap.get(product.title)
                if (subImgList) {
                    product.subImgList = subImgList
                }
            })
        },

        getProductsData(state, action) {
            state.productLoading = true
        },

        getProductsDataSuccess(state, action) {
            state.productsData = action.payload
        },

        setDelayLoading(state, action) {
            state.productLoading = false
        },

        getProductsDataFailure(state, action) {
            state.productLoading = false
        },

        getProductImagesFromStorage(state, action) {
            state.productLoading = true
        },

        getProductImagesFromStorageSuccess(state, action) {
            state.productLoading = false
            state.imagesData = action.payload
        },

        getProductImagesFromStorageFailure(state, action) {
            state.productLoading = false
        },

        getSubImagesFromStorage(state, action) {
            state.productLoading = true
        },

        getSubImagesFromStorageSuccess(state, action) {
            state.productLoading = false
            state.subImagesData = action.payload
        },

        getSubImagesFromStorageFailure(state, action) {
            state.productLoading = false
        },

        getTabImagesFromStorage(state, action) {
            state.productLoading = true
        },

        getTabImagesFromStorageSuccess(state, action) {
            state.productLoading = false
            state.productsData = state.productsData.map(product => {
                return {
                    ...product,
                    tabsImagesData: action.payload,
                }
            })
        },

        getTabImagesFromStorageFailure(state, action) {
            state.productLoading = false
        },

        setProductDataToFirestore(state, action) {
            state.productLoading = true
        },

        setProductDataToFirestoreSuccess(state, action) {
            state.productLoading = false
        },

        setProductDataToFirestoreFailure(state, action) {
            state.productLoading = false
        },

        setUpdateSelectedProductToFirestore(state, action) {
            state.productLoading = true
        },

        setUpdateSelectedProductToFirestoreSuccess(state, action) {
            state.productLoading = false
        },

        setUpdateSelectedProductToFirestoreFailure(state, action) {
            state.productLoading = false
        },

        setRemoveProductDataFromFirestore(state, action) {
            state.productLoading = true
        },

        setRemoveProductDataFromFirestoreSuccess(state, action) {
            state.productLoading = false
        },

        setRemoveProductDataFromFirestoreFailure(state, action) {
            state.productLoading = false
        },

        setOrderList: (state, action) => {
            const { title } = action.payload
            const selectedItemIndex = state.orderList.findIndex(item => item.title === title)
            if (selectedItemIndex === -1) {
                console.log(1)
                state.orderList = [...state.orderList, action.payload]
            } else {
                console.log(2)
                state.orderList[selectedItemIndex] = {
                    ...state.orderList[selectedItemIndex],
                    quantity: action.payload.quantity,
                }
            }
        },

        setIncrement: (state, action) => {
            state.orderList = state.orderList.map(item => {
                if (item.title === action.payload) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                } else return item
            })
        },

        setDecrement: (state, action) => {
            state.orderList = state.orderList.map(item => {
                if (item.title === action.payload) {
                    return {
                        ...item,
                        quantity: item.quantity - 1,
                    }
                } else return item
            })
        },

        setRemove: (state, action) => {
            const { productId } = action.payload
            const selectedItemIndex = state.orderList.findIndex(item => item.productId === productId)
            state.orderList.splice(selectedItemIndex, 1)
        },
    },
})

export default productSlice
