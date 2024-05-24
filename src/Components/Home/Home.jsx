import React from "react"
import Contents from "../Contents/Contents"
import Container from "@mui/material/Container"

const Home = ({ itemData }) => {

    return (
        <Container
            component="main"
            sx={{
                minHeight: {
                    xs: "calc( 100vh - 68.5px - 125px )",
                    md: "calc( 100vh - 68.5px - 160px )",
                    lg: "calc( 100vh - 68.5px - 125px )",
                },
                paddingBottom: "24px",
            }}>
            <Contents itemData={itemData} />
        </Container>
    )
}

export default Home
