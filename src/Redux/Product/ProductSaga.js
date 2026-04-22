import { call, put } from 'redux-saga/effects'
import productSlice from '../Product/ProductSlice'
import {
    getProductListFromFirestore,
    getProductImagesFromStorage,
    getSubImagesFromStorage,
    getTabImagesFromStorage,
    setProductDataToFirestore,
    setUpdateSelectedProductToFirestore,
    setRemoveProductDataFromFirestore,
    uploadProductMainImage,
    setProductTabImageToStorage
} from "../../Utils/firebase"
import showAlert from '../../Components/Alert/Alert'

const {
    setDelayLoading,
    setProductsData,
    getProductsData,
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
        yield put({ type: setDelayLoading.type })
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
        yield put(getProductsData())
    } catch (error) {
        yield put({ type: setProductDataToFirestoreFailure.type, payload: error })
    }
}

export function* setUpdateSelectedProductToFirestoreSaga(action) {
    try {
        const { imageFile, fileLength, tabImageFiles, ...rest } = action.payload

        // 先把新主圖上傳到 Storage 拿真實 download URL，再寫 Firestore，避免 blob URL 落地
        // 註：File 實例的屬性（name、size）都在 prototype 上，Object.keys(file) 永遠是 []，故改用 instanceof
        let mainImgOverride = {}
        if (fileLength && fileLength > 0 && imageFile instanceof File) {
            mainImgOverride = yield call(uploadProductMainImage, imageFile, rest.title)
        }

        if (tabImageFiles && tabImageFiles.length > 0) {
            yield call(setProductTabImageToStorage, tabImageFiles)
        }

        const data = yield call(setUpdateSelectedProductToFirestore, {
            ...rest,
            ...mainImgOverride,
        })
        yield put({ type: setUpdateSelectedProductToFirestoreSuccess.type, payload: data })
        yield call(showAlert, '商品編輯成功', 'success')
        yield put(getProductsData())
    } catch (error) {
        yield put({ type: setUpdateSelectedProductToFirestoreFailure.type, payload: error })
    }
}

export function* setRemoveProductDataFromFirestoreSaga(action) {
    try {
        const data = yield call(setRemoveProductDataFromFirestore, action.payload)
        yield put({ type: setRemoveProductDataFromFirestoreSuccess.type, payload: data })
        yield call(showAlert, '商品刪除成功', 'success')
        yield put(getProductsData())
    } catch (error) {
        yield put({ type: setRemoveProductDataFromFirestoreFailure.type, payload: error })
    }
}