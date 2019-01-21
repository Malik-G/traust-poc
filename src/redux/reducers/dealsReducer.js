const dealsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_DEALS':
            return action.payload;
        default:
            return state;
    }
};

export default dealsReducer;