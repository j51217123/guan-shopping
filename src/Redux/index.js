import { all, takeEvery } from 'redux-saga/effects'


// ProductSlice
import productSlice from './Product/ProductSlice'
import * as productSaga from './Product/ProductSaga'
const { actions: productAction } = productSlice

// rootSaga
export function* rootSaga() {
    yield all([
        // Product Saga
        takeEvery(productAction.getProductsData.type, productSaga.getProductListSaga),
        takeEvery(productAction.getProductImagesFromStorage.type, productSaga.getProductImagesFromStorageSaga),
        takeEvery(productAction.getSubImagesFromStorage.type, productSaga.getSubImagesFromStorageSaga),
        takeEvery(productAction.getTabImagesFromStorage.type, productSaga.getTabImagesFromStorageSaga),
    ])
}

export { productSlice, productSaga, productAction }