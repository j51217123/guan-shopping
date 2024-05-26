import { all, call, delay, put, select, takeEvery } from "redux-saga/effects"
import axios from "axios"
import { createUserApi, checkAdminApi } from "../../Api/Api"
import {
    getAuth,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getIdTokenResult,
} from "firebase/auth"
import userSlice from "../User/UserSlice"
import { navigate } from "../../Utils/UtilityJS"
import showAlert from "../../Components/Alert/Alert"

const {
    checkAdmin,
    loginSuccess,
    loginFailure,
    registerSuccess,
    registerFailure,
    logoutSuccess,
    logoutFailure,
    createUserSuccess,
    createUserFailure,
    checkAdminSuccess,
    checkAdminFailure,
} = userSlice.actions

export function* createUserSaga(action) {
    const { email, password } = action.payload
    // // API call to create user
    // const createUserApi = async (email, password) => {
    //     const response = await axios.post("http://localhost:5000/api/createUserWithAdminRole", { email, password })
    //     return response.data
    // }

    try {
        const data = yield call(createUserApi, email, password)
        console.log("🚀 - data:", data)
        if (data.success) {
            yield put(createUserSuccess(data.uid))
            yield put(checkAdmin(data.uid))
        } else {
            yield put(createUserFailure(data.error))
        }
    } catch (error) {
        if (error.response.data.error === "The email address is already in use by another account.") {
            try {
                const auth = getAuth()
                const registerResult = yield call(signInWithEmailAndPassword, auth, email, password)
                yield put(checkAdmin(registerResult.user.uid))
                yield call(showAlert, "帳戶登入成功", "success")
                localStorage.setItem(
                    "user",
                    JSON.stringify({ email: registerResult.user.email, uid: registerResult.user.uid, isLogin: true })
                )
                yield put(loginSuccess(registerResult.user))
                // navigate("/")
            } catch (registerError) {
                yield put(createUserFailure(error.message))
            }
        } else {
            yield put(createUserFailure(error.message))
        }
    }
}

export function* checkAdminSaga(action) {
    // API call to check admin claim
    // const checkAdminApi = async uid => {
    //     const response = await axios.get(`http://localhost:5000/api/checkAdminClaim/${uid}`)
    //     return response.data
    // }
    try {
        const uid = action.payload
        console.log("🚀 - uid:", uid)
        const data = yield call(checkAdminApi, uid)
        console.log("🚀 - data:", data)
        if (data.isAdmin) {
            yield put(checkAdminSuccess(data.isAdmin))
        } else {
            yield put(checkAdminFailure(new Error("User is not an admin")))
        }
    } catch (error) {
        yield put(checkAdminFailure(error))
    }
}

export function* loginWithGoogleSaga() {
    try {
        const provider = new GoogleAuthProvider()
        const auth = getAuth()
        const result = yield call(signInWithPopup, auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        const user = result.user
        yield put(loginSuccess(user))
        navigate("/")
    } catch (error) {
        yield put(loginFailure(error.message))
    }
}

export function* loginWithEmailSaga({ payload: { email, password } }) {
    const auth = getAuth()
    try {
        const result = yield call(signInWithEmailAndPassword, auth, email, password)
        console.log("🚀 - result:", result)
        yield call(showAlert, "帳戶登入成功", "success")
        const idTokenResult = yield call(getIdTokenResult, result.user)
        console.log("🚀 - idTokenResult:", idTokenResult)
        localStorage.setItem("user", JSON.stringify({ email: result.user.email, uid: result.user.uid, isLogin: true }))
        yield put(loginSuccess(result.user))
        navigate("/")
    } catch (error) {
        if (error.message === "Firebase: Error (auth/invalid-login-credentials).") {
            try {
                const registerResult = yield call(createUserWithEmailAndPassword, auth, email, password)
                yield call(showAlert, "帳戶登入成功", "success")
                localStorage.setItem(
                    "user",
                    JSON.stringify({ email: registerResult.user.email, uid: registerResult.user.uid, isLogin: true })
                )
                yield put(loginSuccess(registerResult.user))
                navigate("/")
            } catch (registerError) {
                yield put(loginFailure(registerError.message))
            }
        } else {
            yield put(loginFailure(error.message))
        }
    }
}

export function* logoutAuthSaga() {
    const auth = getAuth()
    try {
        const result = yield call(signOut, auth)
        yield call(showAlert, "帳戶登出成功", "success")
        localStorage.setItem("user", JSON.stringify({}))
        yield put(logoutSuccess())
        navigate("/")
    } catch (error) {
        yield put(logoutFailure(error.message))
    }
}
