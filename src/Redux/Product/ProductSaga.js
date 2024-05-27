import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects'
import productSlice from '../Product/ProductSlice'
import {
    getProductListFromFirestore,
    getProductImagesFromStorage,
    getSubImagesFromStorage,
    getTabImagesFromStorage,
    setProductDataToFirestore,
    setUpdateSelectedProductToFirestore,
    setRemoveProductDataFromFirestore
} from "../../Utils/firebase"
import showAlert from '../../Components/Alert/Alert'

const {
    setDelayLoading,
    setProductsData,
    getProductsDataSuccess,
    getProductsDataFailure,
    getProductImagesFromStorageSuccess,
    getProductImagesFromStorageFailure,
    getSubImagesFromStorageSuccess,
    getSubImagesFromStorageFailure,
    getTabImagesFromStorageSuccess,
    getTabImagesFromStorageFailure,
    setProductDataToFirestoreSuccess,
    setProductDataToFirestoreFailure,
    setUpdateSelectedProductToFirestoreSuccess,
    setUpdateSelectedProductToFirestoreFailure,
    setRemoveProductDataFromFirestoreSuccess,
    setRemoveProductDataFromFirestoreFailure
} = productSlice.actions

export function* getProductListSaga(action) {
    try {
        const data = yield call(getProductListFromFirestore, action.payload)
        yield put({ type: getProductsDataSuccess.type, payload: data })
        yield delay(1000)
        yield put({ type: setDelayLoading.type })
        // const imageData = yield call(getProductImagesFromStorage, action.payload)
        // yield put({ type: getProductImagesFromStorageSuccess.type, payload: imageData })
        // const subImageData = yield call(getSubImagesFromStorage, action.payload)
        // yield put({ type: getSubImagesFromStorageSuccess.type, payload: subImageData })
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

export function* setProductDataToFirestoreSaga(action) {
    try {
        const data = yield call(setProductDataToFirestore, action.payload)
        yield put({ type: setProductDataToFirestoreSuccess.type, payload: data })
        yield call(showAlert, '商品新增成功', 'success')
        yield delay(1500)
        yield call(() => window.location.reload())
    } catch (error) {
        yield put({ type: setProductDataToFirestoreFailure.type, payload: error })
    }
}

export function* setUpdateSelectedProductToFirestoreSaga(action) {
    try {
        const data = yield call(setUpdateSelectedProductToFirestore, action.payload)
        yield put({ type: setUpdateSelectedProductToFirestoreSuccess.type, payload: data })
        yield call(showAlert, '商品編輯成功', 'success')
        yield delay(1000)
        yield call(() => window.location.reload())
    } catch (error) {
        yield put({ type: setUpdateSelectedProductToFirestoreFailure.type, payload: error })
    }
}

export function* setRemoveProductDataFromFirestoreSaga(action) {
    try {
        const data = yield call(setRemoveProductDataFromFirestore, action.payload)
        yield put({ type: setRemoveProductDataFromFirestoreSuccess.type, payload: data })
        yield call(showAlert, '商品刪除成功', 'success')
        yield delay(1000)
        yield call(() => window.location.reload())
    } catch (error) {
        yield put({ type: setRemoveProductDataFromFirestoreFailure.type, payload: error })
    }
}