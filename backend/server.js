const express = require("express")
const admin = require("firebase-admin")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

// const serviceAccount = {
//     type: "service_account",
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY,
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
//     universe_domain: "googleapis.com",
// }

const serviceAccount = {
    type: "service_account",
    project_id: "guan-shopping-web",
    private_key_id: "5e98f4130e0c2db1bb07cafacc14739eabd3bb26",
    private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAx2BAHkaUwvxZ\nk75EoaCA2C9O0kM6/4YYErBMEAZY1Co3amVWhI7wqn1stNFyBtD6tJwNIIFKbTNV\nxcWJ4CfY0WrQ+ST+pn0Yp82/aQbtil7VlVCRA06cF7PXluURsTMyvSIxdS9zf0EQ\nGXdxkZ5jav8LBpCaRnRhSOM8CxdYwIMM5cQO4EISYLJIBygy8v45GRxp2vLqpg6n\nsp9e06q4PWMPWtH8yFls63PhEgc4YEdxD89IFltf/D4Ya7pw95v6gcHxOya9PY99\n6nx7DF/Qj6Wuwgm81fxF//xCHGWkqLJGTk3wag+t4HJFaJZyR6XRDHQSqcoFXV+B\n/vciEFpvAgMBAAECggEAXEIOaiETHjaClkwCjs3bBk5vtYUi76VCA1tOS9iPcQt4\neLTOcq1Vyw+Mnu2aHrvsX074L8ASoA/KtY3Ej8taxoTSXdgeQFBlJduIt8YHrr69\ny/F9cSjoAgPF6bMpRWJMYkfpiUnPv7Jy7MWDSDKsXl/iVuB5a5u0Lqq3NREJx0rj\ntBp2yIOr0Fp1zuEv9dC6BL9mLe284rEqnB+VG7Qx6z/wXzSauE4p3FBX/O3ppDhB\nQ4KxwBKXthok00u4KCDQjjC4OlYV0KneBWaVAnQXWX26e/q+QTJSAzwo0OuIJbcw\nvpTlY2Murj+IJZ19pLV9DDqBWYeIaAovwnRZNRH2YQKBgQD/i4iqDEhtoKP8rYKI\nR4c4p78Ywjwjz7GclhO3jJvAf/ViOLtXmgWYh6yHCZhkrzIp3thEKEpwRWDt+BO1\nVI3r9ozBUy541a98fHhklHTk+ibAshCD29eCWvScQZJdxbvHZNL0DRiK0nQYrdRZ\nVPhHX+W2deRu6R5x/uNjKvZw/QKBgQDBHzxt3F+0J4H01WRo4bf5wuasqtIT0+Tk\n4mzYQOM13zMtJmBRw1yT0d30mgwLUkgoP8++CK2nlJFdJDl/aj1o+sW1Ap800elO\nVazGwoF1suECjZRIsgHxh+/zE5pxxg1qbPHNM5jwGNm0SAhxNETwiCPKFX/Uog1v\nBmuzfhQa2wKBgAp6LxVBwap0/qQ6fPKXdCzXe9dJB2w0dMTFxnMtGamv1WC8kLnL\nv9T8Iw+6Tfw6zqS21UkeGcc2oP3AwRYbLGJzTlwSzAH6SOKiu9Dr4UsOEo6t/k1Z\nsyFOF19ctOKRW9yV/qww6UOv00C7x8wN1sweW226sa32cuAbojkLpuUFAoGAbLWD\nk6f4a3XNzp8MXYmpwTs4FDw38xdVAo5+jKDCBYI10ZWHpJ7fDwqU8WqBmyHfImEB\nNMy3y9xyk0af4xxPozd+cS0fp2D9/q11i5DTxQhDZueBcAZb17UYmfEQADlnNeBL\noKIJ1iV27ueZcPfmUquf0dKWWYA7JaMsnyY6dP8CgYB6GDvHkWWkEOJap9O7DFQi\n9E33VNSn7ZoD71KGdxSFxUm7OS7X4ZNKgVHjYt9w5jnqUelR7e/Tl4kHgfkTCF1v\nU+b2Vh4aCX2d+2y8hhg1t95FhjjFNG7IQzcm4Bexx4drlD60wT3wiSfe3Xeo4yiI\nycTHx/uj3SSTxnfhKdI+ig==\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-2vi2o@guan-shopping-web.iam.gserviceaccount.com",
    client_id: "114847449094717224303",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2vi2o%40guan-shopping-web.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guan-shopping-bf7df-default-rtdb.firebaseio.com",
})

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://guan-shopping-bf7df.firebaseapp.com",
        "https://guan-shopping-bf7df.web.app/",
    ],
    optionsSuccessStatus: 200,
}

const app = express()
app.use(cors(corsOptions))
app.use(bodyParser.json())

app.post("/api/createUserWithAdminRole", async (req, res) => {
    const { email, password } = req.body

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        })

        await admin.auth().setCustomUserClaims(userRecord.uid, { member: true })

        res.status(200).send({ success: true, uid: userRecord.uid })
    } catch (error) {
        res.status(500).send({ success: false, error: error.message })
    }
})

app.get("/api/checkAdminClaim/:uid", async (req, res) => {
    const { uid } = req.params

    try {
        const userRecord = await admin.auth().getUser(uid)

        if (userRecord.customClaims && userRecord.customClaims.member === true) {
            res.status(200).send({ isMember: true })
        } else {
            res.status(200).send({ isMember: false })
        }
    } catch (error) {
        res.status(500).send({ success: false, error: error.message })
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
