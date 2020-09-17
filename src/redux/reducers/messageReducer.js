const initialState = {
    data: []
}
export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_MESSAGES":
            return {
                ...state,
                data: action.payload
            };
        case "SET_NEW_MESSAGE":
            const { room_id } = action.payload
            let room = state.data.find(e => e._id = room_id)
            room.messages = [message, ...action.payload]
            state.data = state.data.map(e => e._id === room_id ? room : e)
            return {
                ...state
            }
        default:
            return state
    }
}
