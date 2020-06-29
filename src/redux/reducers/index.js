import { combineReducers } from 'redux';
// Imports: Reducers
import userReducer from './userReducer'
import messageReducer from './messageReducer'

// Redux: Root Reducer
const rootReducer = combineReducers({
    userReducer,
    messageReducer
});
// Exports
export default rootReducer;