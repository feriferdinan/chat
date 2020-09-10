import { combineReducers } from 'redux';
// Imports: Reducers
import userReducer from './userReducer'
import messageReducer from './messageReducer'
import contactReducer from './contactReducer'

// Redux: Root Reducer
const rootReducer = combineReducers({
    userReducer,
    messageReducer,
    contactReducer,
});
// Exports
export default rootReducer;