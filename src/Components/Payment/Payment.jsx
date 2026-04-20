import React, { useState } from "react"
import { Button } from "@mui/material"
import axios from "axios"
import { useSelector } from "react-redux"

const PAYMENT_API = process.env.REACT_APP_PAYMENT_API || "https://guan-shopping-backend.zeabur.app"

const Payment = ({ totalAmount, tradeDesc, itemName, fullWidth = true, ...rest }) => {
    const orderList = useSelector(state => state.products.orderList)
    const [loading, setLoading] = useState(false)

    const resolveItemName = () => {
        if (itemName) return itemName
        if (orderList?.length) return orderList.map(item => item.title).join()
        return "商品結帳"
    }

    const handlePayment = async () => {
        if (loading) return
        setLoading(true)
        try {
            const { data } = await axios.post(`${PAYMENT_API}/api/payment/create`, {
                totalAmount: totalAmount || 100,
                tradeDesc: tradeDesc || "商品結帳",
                itemName: resolveItemName(),
            })

            if (!data?.success) {
                throw new Error(data?.error || "建立訂單失敗")
            }

            // 後端回傳簽章好的 params，前端只負責組 form POST 到綠界
            const form = document.createElement("form")
            form.method = "post"
            form.action = data.apiUrl
            Object.entries(data.params).forEach(([key, value]) => {
                const input = document.createElement("input")
                input.type = "hidden"
                input.name = key
                input.value = value
                form.appendChild(input)
            })
            document.body.appendChild(form)
            form.submit()
        } catch (error) {
            console.error("[Payment] 建立訂單失敗", error)
            alert("建立訂單失敗，請稍後再試")
            setLoading(false)
        }
    }

    return (
        <Button
            {...rest}
            fullWidth={fullWidth}
            variant="contained"
            disabled={loading}
            onClick={handlePayment}>
            {loading ? "處理中..." : "結帳"}
        </Button>
    )
}

export default Payment
