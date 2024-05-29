import { Provider } from 'react-redux'
import configureAppStore from '../../Redux/configureStore'

const store = configureAppStore()

const withRedux = (ComposeComponent) => {
    return props => {
        return (
            <Provider store={ store } >
                <ComposeComponent { ...props } />
            </Provider>
            )
        }
    }

export default withRedux