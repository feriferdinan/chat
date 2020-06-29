const initialState = {
    data: {},
    isLogin: false
}
export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                data: action.payload,
                isLogin: true
            };
        case "REMOVE_USER":
            return initialState
        default:
            return state
    }
}
