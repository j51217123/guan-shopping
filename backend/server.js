const express = require("express")
const admin = require("firebase-admin")
const bodyParser = require("body-parser")
const cors = require("cors")

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guan-shopping-bf7df-default-rtdb.firebaseio.com/",
})

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post("/api/createUserWithAdminRole", async (req, res) => {
    const { email, password } = req.body

    try {
        // 创建用户
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        })

        // 设置自定义用户声明
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true })

        res.status(200).send({ success: true, uid: userRecord.uid })
    } catch (error) {
        res.status(500).send({ success: false, error: error.message })
    }
})

// 检查用户的自定义声明 API
app.get("/api/checkAdminClaim/:uid", async (req, res) => {
    const { uid } = req.params

    try {
        console.log(1)
        const userRecord = await admin.auth().getUser(uid)
        if (userRecord.customClaims && userRecord.customClaims.admin === true) {
            res.status(200).send({ isAdmin: true })
        } else {
            res.status(200).send({ isAdmin: false })
        }
    } catch (error) {
        res.status(500).send({ success: false, error: error.message })
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
