const initialState = {
    data: []
}
export default function contactReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_CONTACT":
            return {
                ...state,
                data: action.payload
            };
        default:
            return state
    }
}
