const initialState = {
    data: {}
}
export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_MESSAGE":
            return {
                ...state,
                data: action.payload
            };
        default:
            return state
    }
}
