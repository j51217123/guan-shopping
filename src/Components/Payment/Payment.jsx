import React from "react"
import axios from "axios"

const Payment = () => {
    const handlePayment = async () => {
        try {
            const response = await axios.get("https://guan-shopping-backend.zeabur.app/test")
            console.log("🚀 - data:", response.data)
            console.log("🚀 - response:", response)

            // 打開新窗口
            const newWindow = window.open("", "_blank", "width=800,height=600")
            if (newWindow) {
                newWindow.document.open()
                newWindow.document.write(response.data)
                newWindow.document.close()
            } else {
                console.error("新窗口無法打開，可能被瀏覽器阻止了")
            }
        } catch (error) {
            console.error("Error fetching payment page:", error)
        }
    }

    return (
        <div>
            <button onClick={handlePayment}>Start Payment</button>
        </div>
    )
}

export default Payment