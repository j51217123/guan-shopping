import React from "react"
import axios from "axios"
import CryptoJS from "crypto-js"

////////////////////////改以下參數即可////////////////////////
//一、選擇帳號，是否為測試環境
const MerchantID = "3002607" //必填
const HashKey = "pwFHCqoQZGmho4w6" //3002607
const HashIV = "EkRm7iFT261dpevs" //3002607
let isStage = true // 測試環境： true；正式環境：false

//二、輸入參數
// const TotalAmount = "100"
// const TradeDesc = "測試敘述"
// const ItemName = "測試名稱"
const ReturnURL = "https://guan-shopping-backend.zeabur.app/payment/callback"
const ChoosePayment = "ALL"

////////////////////////以下參數不用改////////////////////////
const stage = isStage ? "-stage" : ""
const algorithm = "sha256"
const digest = "hex"
const APIURL = `https://payment${isStage ? "-stage" : ""}.ecpay.com.tw/Cashier/AioCheckOut/V5`
const MerchantTradeNo = `od${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}${new Date()
    .getHours()
    .toString()
    .padStart(2, "0")}${new Date().getMinutes().toString().padStart(2, "0")}${new Date()
    .getSeconds()
    .toString()
    .padStart(2, "0")}${new Date().getMilliseconds().toString().padStart(2, "0")}`

const MerchantTradeDate = new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
})

//三、計算 CheckMacValue 之前
// let ParamsBeforeCMV = {
//     MerchantID: MerchantID,
//     MerchantTradeNo: MerchantTradeNo,
//     MerchantTradeDate: MerchantTradeDate.toString(),
//     PaymentType: "aio",
//     EncryptType: 1,
//     TotalAmount: TotalAmount,
//     TradeDesc: TradeDesc,
//     ItemName: ItemName,
//     ReturnURL: ReturnURL,
//     ChoosePayment: ChoosePayment,
// }

//四、計算 CheckMacValue
function CheckMacValueGen(parameters, algorithm, digest) {
    // const crypto = require("crypto")
    let Step0

    Step0 = Object.entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")

    function DotNETURLEncode(string) {
        const list = {
            "%2D": "-",
            "%5F": "_",
            "%2E": ".",
            "%21": "!",
            "%2A": "*",
            "%28": "(",
            "%29": ")",
            "%20": "+",
        }

        Object.entries(list).forEach(([encoded, decoded]) => {
            const regex = new RegExp(encoded, "g")
            string = string.replace(regex, decoded)
        })

        return string
    }

    const Step1 = Step0.split("&")
        .sort((a, b) => {
            const keyA = a.split("=")[0]
            const keyB = b.split("=")[0]
            return keyA.localeCompare(keyB)
        })
        .join("&")
    const Step2 = `HashKey=${HashKey}&${Step1}&HashIV=${HashIV}`
    const Step3 = DotNETURLEncode(encodeURIComponent(Step2))
    const Step4 = Step3.toLowerCase()
    // const Step5 = crypto.createHash(algorithm).update(Step4).digest(digest)
    const Step5 = CryptoJS.SHA256(Step4).toString(CryptoJS.enc.Hex)
    const Step6 = Step5.toUpperCase()
    return Step6
}

//五、將所有的參數製作成 payload
// const AllParams = { ...ParamsBeforeCMV, CheckMacValue }
// const inputs = Object.entries(AllParams)
//     .map(function (param) {
//         return `<input name=${param[0]} value="${param[1].toString()}"><br/>`
//     })
//     .join("")

//六、製作送出畫面
// const htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
//     <title>全方位金流測試</title>
// </head>
// <body>
//     <form method="post" action="${APIURL}">
// ${inputs}
// <input type ="submit" value = "送出參數">
//     </form>
// </body>
// </html>
// `

const Payment = ({ totalAmount, tradeDesc, itemName }) => {
    const TotalAmount = totalAmount ? totalAmount : "100"
    const TradeDesc = tradeDesc ? tradeDesc : "測試敘述"
    const ItemName = itemName ? itemName : "測試名稱"

    let ParamsBeforeCMV = {
        MerchantID: MerchantID,
        MerchantTradeNo: MerchantTradeNo,
        MerchantTradeDate: MerchantTradeDate.toString(),
        PaymentType: "aio",
        EncryptType: 1,
        TotalAmount: TotalAmount,
        TradeDesc: TradeDesc,
        ItemName: ItemName,
        ReturnURL: ReturnURL,
        ChoosePayment: ChoosePayment,
    }
    const CheckMacValue = CheckMacValueGen(ParamsBeforeCMV, algorithm, digest)
    const AllParams = { ...ParamsBeforeCMV, CheckMacValue }
    const inputs = Object.entries(AllParams)
        .map(function (param) {
            return `<input name=${param[0]} type="hidden" value="${param[1].toString()}"><br/>`
        })
        .join("")

    const htmlContent = `
        <form method="post" id="payment_form" action="${APIURL}">
            ${inputs}
            <input type ="submit" value = "送出參數">
            <script type="text/javascript">document.getElementById("payment_form").submit();</script>
        </form>

    `

    const handlePayment = async () => {
        // try {
        //     const response = await axios.get("https://guan-shopping-backend.zeabur.app/test")
        //     console.log("🚀 - data:", response.data)
        //     console.log("🚀 - response:", response)

        //     // 打開新窗口
        //     const newWindow = window.open("", "_blank", "width=800,height=600")
        //     if (newWindow) {
        //         newWindow.document.open()
        //         newWindow.document.write(response.data)
        //         newWindow.document.close()
        //     } else {
        //         console.error("新窗口無法打開，可能被瀏覽器阻止了")
        //     }
        // } catch (error) {
        //     console.error("Error fetching payment page:", error)
        // }
        // document.write(`${htmlContent}`)
        const form = document.createElement("form")
        form.method = "post"
        form.action = APIURL

        Object.entries(AllParams).forEach(([key, value]) => {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = value
            form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
    }

    return (
        <div>
            <button onClick={handlePayment}>Start Payment</button>
        </div>
    )
}

export default Payment
