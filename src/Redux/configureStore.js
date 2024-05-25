import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"

import productSlice from "../Redux/Product/ProductSlice"
import userSlice from "../Redux/User/UserSlice"
import { rootSaga } from '../Redux/index'
import createSagaMiddleware from 'redux-saga'

export const createReducer = () => {
    const rootReducer = combineReducers({
        products: productSlice.reducer,
        user: userSlice.reducer
    })
    return rootReducer
}
export default function configureAppStore(initialState = {}) {
    const reduxSagaMonitorOptions = {}
    const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions)
    const { run: runSaga } = sagaMiddleware
    // Store
    const store = configureStore({
        reducer: createReducer(),
        preloadedState: initialState,
        middleware: [...getDefaultMiddleware({ serializableCheck: false }), sagaMiddleware]
    })
    runSaga(rootSaga)
    return store
}