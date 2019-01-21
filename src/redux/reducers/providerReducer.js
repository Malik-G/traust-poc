import {combineReducers} from 'redux';

// Used to store quotes
const providerReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_PROVIDERS':
            return action.payload;
        default:
            return state;
    }
}
  
export default combineReducers({
    providerReducer,
});
