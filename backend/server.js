const express = require("express")
const admin = require("firebase-admin")
const path = require("path")
const bodyParser = require("body-parser")
const cors = require("cors")
const axios = require("axios")
const qs = require("qs")
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
    origin: "*",
    optionsSuccessStatus: 200,
    header: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
}

const app = express()
app.use(cors(corsOptions))
app.use(bodyParser.json())

// 配置静态文件路径
app.use(express.static(path.join(__dirname, "..", "build")))

app.get("/api/test", (req, res) => {
    res.json({
        message: "Hello World",
    })
})

// 处理所有其他路由，返回 index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"))
})

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

// 綠界支付測試環境 URL
const ECPAY_API_URL = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"

// 綠界支付參數
const ECPAY_PARAMS = {
    MerchantID: "3002607",
    MerchantTradeNO: "ecpay20240101000000",
    MerchantTradeDate: "2024/01/01 00:00:00",
    PaymentType: "aio",
    TotalAmount: "100",
    TradeDesc: "testtrade",
    ItemName: "testitem",
    ReturnURL: "  https://697b-211-75-237-68.ngrok-free.app",
    ChoosePayment: "ALL",
    EncryptType: "1",
    CheckMacValue: "D4CE5F6B5EAC4F125FBF8A99AACA283CCDB14B09509CFFB6A663B78FCEF8C3AD",
}

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

// 模擬提交支付請求的路由
app.post("/create_payment", async (req, res) => {
    const { MerchantTradeNo, MerchantTradeDate, TotalAmount, TradeDesc, ItemName } = req.body

    // 設置支付參數
    // const params = {
    //     ...ECPAY_PARAMS,
    //     MerchantTradeNo,
    //     MerchantTradeDate,
    //     TotalAmount,
    //     TradeDesc,
    //     ItemName,
    // }
    const params = ECPAY_PARAMS
    // 生成檢查碼
    const hashKey = "pwFHCqoQZGmho4w6"
    const hashIV = "EkRm7iFT261dpevs"
    const crypto = require("crypto")
    const queryString = qs.stringify(params)
    const hashString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`
    const checkMacValue = crypto.createHash("md5").update(hashString).digest("hex").toUpperCase()
    // params.CheckMacValue = checkMacValue

    try {
        const response = axios.post(ECPAY_API_URL, ECPAY_PARAMS)
        console.log("🚀 - response:", response)
        res.status(200).send(response.data)
    } catch (error) {
        console.error("Error creating ecpay payment:", error)
        res.status(500).send("Error creating ecpay payment")
    }
})

// 綠界支付回傳結果的路由
app.post("/ecpay_return", (req, res) => {
    console.log("ECPay Return:", req.body)
    res.send("OK")
})

// 支付結果顯示頁面
app.get("/ecpay_result", (req, res) => {
    res.send("Payment Result Page")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app
