const types = (state = [], action) => {
    switch (action.type) {
        case 'SET_AUTHORIZATION_TYPES':
            return action.payload;
        default:
            return state;
    }
}


export default types;