import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects'
import productSlice from '../Product/ProductSlice'
import {
    getProductListFromFirestore,
    getProductImagesFromStorage,
    getSubImagesFromStorage,
    getTabImagesFromStorage
} from "../../Utils/firebase"

const {
    setProductsData,
    getProductsDataSuccess,
    getProductsDataFailure,
    getProductImagesFromStorageSuccess,
    getProductImagesFromStorageFailure,
    getSubImagesFromStorageSuccess,
    getSubImagesFromStorageFailure,
    getTabImagesFromStorageSuccess,
    getTabImagesFromStorageFailure
} = productSlice.actions

export function* getProductListSaga(action) {
    try {
        const data = yield call(getProductListFromFirestore, action.payload)
        yield put({ type: getProductsDataSuccess.type, payload: data })
        const imageData = yield call(getProductImagesFromStorage, action.payload)
        yield put({ type: getProductImagesFromStorageSuccess.type, payload: imageData })
        const subImageData = yield call(getSubImagesFromStorage, action.payload)
        yield put({ type: getSubImagesFromStorageSuccess.type, payload: subImageData })
        // const tabImageData = yield call(getTabImagesFromStorage, action.payload)
        // yield put({ type: getTabImagesFromStorageSuccess.type, payload: tabImageData })
        yield put({ type: setProductsData.type })

    } catch (error) {
        yield put({ type: getProductsDataFailure.type, payload: error })
    }
}

export function* getProductImagesFromStorageSaga(action) {
    try {
        const data = yield call(getProductImagesFromStorage, action.payload)
        yield put({ type: getProductImagesFromStorageSuccess.type, payload: data })
    } catch (error) {
        yield put({ type: getProductImagesFromStorageFailure.type, payload: error })
    }
}

export function* getSubImagesFromStorageSaga(action) {
    try {
        const data = yield call(getSubImagesFromStorage, action.payload)
        yield put({ type: getSubImagesFromStorageSuccess.type, payload: data })
    } catch (error) {
        yield put({ type: getSubImagesFromStorageFailure.type, payload: error })
    }
}

export function* getTabImagesFromStorageSaga(action) {
    try {
        const data = yield call(getTabImagesFromStorage, action.payload)
        yield put({ type: getTabImagesFromStorageSuccess.type, payload: data })
    } catch (error) {
        yield put({ type: getTabImagesFromStorageFailure.type, payload: error })
    }
}