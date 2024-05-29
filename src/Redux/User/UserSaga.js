import { all, call, delay, put, select, takeEvery } from "redux-saga/effects"
import { createUserApi, checkAdminApi } from "../../Api/Api"
import {
    getAuth,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getIdTokenResult,
    sendPasswordResetEmail,
} from "firebase/auth"
import userSlice from "../User/UserSlice"
import { navigate } from "../../Utils/UtilityJS"
import showAlert from "../../Components/Alert/Alert"

const {
    setIsMember,
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
    resetPasswordSuccess,
    resetPasswordFailure,
} = userSlice.actions

export function* createUserSaga(action) {
    const { email, password } = action.payload

    try {
        const data = yield call(createUserApi, email, password)
        if (data.success) {
            yield put(createUserSuccess(data.uid))
            // yield put(checkAdmin(data.uid))
        } else {
            yield put(createUserFailure(data.error))
        }
    } catch (error) {
        if (error?.response?.data?.error === "The email address is already in use by another account.") {
            try {
                const auth = getAuth()
                const registerResult = yield call(signInWithEmailAndPassword, auth, email, password)
                // yield put(checkAdmin(registerResult.user.uid))
                yield call(showAlert, "帳戶登入成功", "success")
                localStorage.setItem(
                    "user",
                    JSON.stringify({ email: registerResult.user.email, uid: registerResult.user.uid, isLogin: true })
                )
                localStorage.setItem("isMember", true)
                yield put({ type: setIsMember.type, payload: true })
                yield put(loginSuccess(registerResult.user))
                navigate("/")
            } catch (registerError) {
                yield put(createUserFailure(error.message))
                yield call(showAlert, "帳戶登入或註冊失敗", "error")
            }
        } else {
            yield put(createUserFailure(error.message))
            yield call(showAlert, "帳戶登入失敗", "error")
        }
    }
}

export function* checkAdminSaga(action) {
    try {
        const uid = action.payload
        const data = yield call(checkAdminApi, uid)
        if (data.isMember) {
            // yield put(checkAdminSuccess(data.isMember))
            yield put({ type: setIsMember.type, payload: true })
            navigate("/")
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
        localStorage.setItem("user", JSON.stringify({ email: result.user.email, uid: result.user.uid, isLogin: true }))
        localStorage.setItem("isMember", true)
        navigate("/")
        yield put({ type: setIsMember.type, payload: true })
    } catch (error) {
        yield put(loginFailure(error.message))
        yield call(showAlert, "帳戶登入失敗", "error")
    }
}

export function* loginWithEmailSaga({ payload: { email, password } }) {
    const auth = getAuth()
    try {
        const result = yield call(signInWithEmailAndPassword, auth, email, password)
        yield call(showAlert, "帳戶登入成功", "success")
        const idTokenResult = yield call(getIdTokenResult, result.user)
        localStorage.setItem("user", JSON.stringify({ email: result.user.email, uid: result.user.uid, isLogin: true }))
        localStorage.setItem("isMember", true)
        yield put(loginSuccess(result.user))
        navigate("/")
        yield put({ type: setIsMember.type, payload: true })
    } catch (error) {
        if (error.message === "Firebase: Error (auth/invalid-login-credentials).") {
            try {
                const registerResult = yield call(createUserWithEmailAndPassword, auth, email, password)
                yield call(showAlert, "帳戶登入成功", "success")
                localStorage.setItem(
                    "user",
                    JSON.stringify({ email: registerResult.user.email, uid: registerResult.user.uid, isLogin: true })
                )
                localStorage.setItem("isMember", true)
                yield put(loginSuccess(registerResult.user))
                navigate("/")
                yield put({ type: setIsMember.type, payload: true })
            } catch (registerError) {
                yield put(loginFailure(registerError.message))
                yield call(showAlert, "帳戶登入失敗", "error")
            }
        } else {
            yield put(loginFailure(error.message))
            yield call(showAlert, "帳戶登入失敗", "error")
        }
    }
}

export function* logoutAuthSaga() {
    const auth = getAuth()
    try {
        const result = yield call(signOut, auth)
        yield call(showAlert, "帳戶登出成功", "success")
        localStorage.removeItem("user")
        localStorage.removeItem("isMember")
        yield put(logoutSuccess())
        navigate("/")
        yield put({ type: setIsMember.type, payload: false })
    } catch (error) {
        yield put(logoutFailure(error.message))
    }
}

export function* resetPasswordSaga({ payload: email }) {
    const auth = getAuth()
    try {
        const result = yield call(sendPasswordResetEmail, auth, email)
        yield put(resetPasswordSuccess(result))
        yield call(showAlert, "認證信件發送成功", "success")
    } catch (error) {
        yield put(resetPasswordFailure(error.message))
        yield call(showAlert, "認證信件發送失敗", "error")
    }
}