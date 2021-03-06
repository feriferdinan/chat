import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import middlewares from './middleware';
// Imports: Redux
import rootReducer from './reducers/index';

// Middleware: Redux Persist Config
const persistConfig = {
    // Root?
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    // whitelist: [
    //     'authReducer',
    // ],
    // Blacklist (Don't Save Specific Reducers)
    // blacklist: [
    //     'loginReducer',
    //     'registerReducer'
    // ],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Redux: Store
const store = createStore(
    persistedReducer,
    applyMiddleware(...middlewares),
);

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

// Exports
export {
    store,
    persistor,
};