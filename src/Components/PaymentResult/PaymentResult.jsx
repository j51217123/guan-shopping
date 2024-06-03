import React, { useEffect } from "react"
import { useNavigate  } from "react-router-dom"

const PaymentResult = () => {
    const navigate = useNavigate ()

    useEffect(() => {
        // 假设支付成功后要重定向到首页
        setTimeout(() => {
            navigate.push("/")
        }, 2000) // 3秒后重定向到首页
    }, [navigate])

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>You will be redirected to the homepage shortly...</p>
        </div>
    )
}

export default PaymentResult
