import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

const withThemeProvider = (ComposedComponent) => (props) => {
    return (
        <ThemeProvider theme={theme}>
            <ComposedComponent {...props} />
        </ThemeProvider>
    )
}

export default withThemeProvider