import { all, call, delay, put, select, takeEvery } from "redux-saga/effects"
import {
    getAuth,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth"
import userSlice from "../User/UserSlice"
import { navigate } from "../../Utils/UtilityJS"
import showAlert from "../../Components/Alert/Alert"

const { loginSuccess, loginFailure, registerSuccess, registerFailure, logoutSuccess, logoutFailure } = userSlice.actions

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
        yield call(showAlert, "帳戶登入成功", "success")
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
        localStorage.setItem(
            "user",
            JSON.stringify({})
        )
        yield put(logoutSuccess())
        navigate("/")
    } catch (error) {
        yield put(logoutFailure(error.message))
    }
}
