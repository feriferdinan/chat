import { combineReducers } from 'redux';
// Imports: Reducers
import authReducer from './authReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
    authReducer: authReducer.auth,
});
// Exports
export default rootReducer;