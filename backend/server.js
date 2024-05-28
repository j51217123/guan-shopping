const express = require("express")
const admin = require("firebase-admin")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com",
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guan-shopping-web-default-rtdb.firebaseio.com/",
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

module.exports = app