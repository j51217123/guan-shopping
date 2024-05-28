/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https")
const logger = require("firebase-functions/logger")

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions")
const admin = require("firebase-admin")
const axios = require("axios")

admin.initializeApp()

exports.ecpayPayment = functions.https.onRequest(async (req, res) => {
    // const { amount, description } = req.body

    // 這裡應該設置你的綠界 API 設定
    const ecpayConfig = {
        MerchantID: "你的商店 ID",
        HashKey: "你的 HashKey",
        HashIV: "你的 HashIV",
        // 其他綠界 API 所需的參數
    }

    // 構建綠界的付款請求

    const paymentData = {
        MerchantID: "3002607",
        MerchantTradeNO: "ecpay20240101000000",
        MerchantTradeDate: "2024/01/01 00:00:00",
        PaymentType: "aio",
        TotalAmount: "100",
        TradeDesc: "testtrade",
        ItemName: "testitem",
        ReturnURL: "https://3f8f-211-75-237-68.ngrok-free.app",
        ChoosePayment: "ALL",
        EncryptType: "1",
    }

    // 生成檢查碼
    const checkMacValue = "D4CE5F6B5EAC4F125FBF8A99AACA283CCDB14B09509CFFB6A663B78FCEF8C3AD"
    paymentData.CheckMacValue = checkMacValue
    console.log("🚀 - paymentData:", paymentData)

    // 發送請求到綠界的測試環境
    try {
        const response = await axios.post("https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5", paymentData)
        res.status(200).send(response.data)
    } catch (error) {
        console.error("Error creating ecpay payment:", error)
        res.status(500).send("Error creating ecpay payment")
    }
})