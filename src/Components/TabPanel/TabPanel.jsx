import * as React from "react"
import { Tabs, Tab, Typography, Box } from "@mui/material"

function TabPanel(props) {
    const { children, value, index, ...other } = props
    const { tabsImagesData } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{ p: 2, gap: "10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {tabsImagesData?.map((tabImages, index) => {
                        return <Box sx={{objectFit: 'contain'}} key={index} component="img" src={tabImages} width="800px" height="600px" />
                    })}
                    <Typography dangerouslySetInnerHTML={{ __html: `${children}` }} sx={{ p: 1 }} />
                </Box>
            )}
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    }
}

const BasicTabs = props => {
    const [value, setValue] = React.useState(0)
    const { tabDesc, deliveryDesc, tabsImagesData } = props

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="商品描述" {...a11yProps(0)} />
                    <Tab label="送貨及付款方式" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel tabsImagesData={tabsImagesData} value={value} index={0}>
                {tabDesc}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {deliveryDesc}
            </TabPanel>
        </Box>
    )
}

export default BasicTabs
