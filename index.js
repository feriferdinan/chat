/**
 * @format
 */
import React from 'react'
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';

// App
import App from './src/App';
// Imports: Redux Persist Persister
import { store, persistor } from './src/redux/store';

WrapperApp = () => {
    return (
        // Redux: Global Store
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor} >
                <App />
            </PersistGate>
        </Provider>
    );
};

AppRegistry.registerComponent(appName, () => WrapperApp);
