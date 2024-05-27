import { all, takeEvery } from 'redux-saga/effects'


// ProductSlice
import productSlice from './Product/ProductSlice'
import * as productSaga from './Product/ProductSaga'

// UserSlice
import userSlice from './User/UserSlice'
import * as userSaga from './User/UserSaga'

const { actions: productAction } = productSlice
const { actions: userAction } = userSlice

// rootSaga
export function* rootSaga() {
    yield all([
        // Product Saga
        takeEvery(productAction.getProductsData.type, productSaga.getProductListSaga),
        takeEvery(productAction.getProductImagesFromStorage.type, productSaga.getProductImagesFromStorageSaga),
        takeEvery(productAction.getSubImagesFromStorage.type, productSaga.getSubImagesFromStorageSaga),
        takeEvery(productAction.getTabImagesFromStorage.type, productSaga.getTabImagesFromStorageSaga),
        takeEvery(productAction.setProductDataToFirestore.type, productSaga.setProductDataToFirestoreSaga),
        takeEvery(productAction.setUpdateSelectedProductToFirestore.type, productSaga.setUpdateSelectedProductToFirestoreSaga),
        takeEvery(productAction.setRemoveProductDataFromFirestore.type, productSaga.setRemoveProductDataFromFirestoreSaga),

        // User Saga
        takeEvery(userAction.loginWithGoogle.type, userSaga.loginWithGoogleSaga),
        takeEvery(userAction.loginRequest.type, userSaga.loginWithEmailSaga),
        takeEvery(userAction.logoutRequest.type, userSaga.logoutAuthSaga),
        takeEvery(userAction.createUserRequest.type, userSaga.createUserSaga),
        takeEvery(userAction.checkAdmin.type, userSaga.checkAdminSaga),
        takeEvery(userAction.resetPassword.type, userSaga.resetPasswordSaga),
    ])
}

export { productSlice, productSaga, productAction, userSlice, userSaga, userAction }