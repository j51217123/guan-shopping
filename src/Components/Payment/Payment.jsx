import React from "react"
import CryptoJS from "crypto-js"
import { Button } from "@mui/material"
import axios from "axios"

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
const ReturnURL = "https://guan-shopping-web.web.app/payResult"
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

const Payment = ({ totalAmount, tradeDesc, itemName, fullWidth = true, ...rest }) => {
    const TotalAmount = totalAmount ? totalAmount : "100"
    const TradeDesc = tradeDesc ? tradeDesc : "測試敘述"
    const ItemName = itemName ? itemName : "測試名稱"
    //三、計算 CheckMacValue 之前
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
        ClientBackURL: "https://guan-shopping-web.web.app/payment-result",
    }
    const CheckMacValue = CheckMacValueGen(ParamsBeforeCMV, algorithm, digest)
    //五、將所有的參數製作成 payload -1
    const AllParams = { ...ParamsBeforeCMV, CheckMacValue }

    const handlePayment = async () => {
        // const form = document.createElement("form")
        // form.method = "post"
        // form.action = APIURL
        // //五、將所有的參數製作成 payload -2
        // Object.entries(AllParams).forEach(([key, value]) => {
        //     const input = document.createElement("input")
        //     input.type = "hidden"
        //     input.name = key
        //     input.value = value
        //     form.appendChild(input)
        // })

        // document.body.appendChild(form)
        // form.submit()
        const params = {
            totalAmount: totalAmount,
            tradeDesc: tradeDesc,
            itemName: itemName
        }
        try {
            const response = await axios.get("https://guan-shopping-backend.zeabur.app/test", { params });
            console.log("🚀 - response:", response);

            const htmlContent = response.data;

            // Create a new div element and set its innerHTML to the response HTML
            const div = document.createElement('div');
            div.innerHTML = htmlContent;

            // Find the form element in the response HTML
            const form = div.querySelector('form');

            if (form) {
                // Append the form to the body
                document.body.appendChild(form);

                // Submit the form
                form.submit();
            } else {
                console.error('No form found in the response HTML');
            }
        } catch (error) {
            console.error('Error fetching the form:', error);
        }
    }

    return (
        <Button {...rest} fullWidth={fullWidth} variant="contained" onClick={handlePayment}>
            結帳
        </Button>
    )
}

export default Payment
