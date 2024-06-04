import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Container } from "@mui/material"

const PaymentResult = () => {
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate("/")
        }, 2000)
    }, [navigate])


    return (
        <Container
            sx={{
                minHeight: {
                    xs: "calc( 100vh - 68.5px - 140px )",
                    md: "calc( 100vh - 68.5px - 150px )",
                    lg: "calc( 100vh - 68.5px - 150px )",
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
            <h1>付款成功</h1>
            <p>請稍後，將自動重新導回首頁....</p>
        </Container>
    )
}

export default PaymentResult
