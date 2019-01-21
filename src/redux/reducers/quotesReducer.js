import {combineReducers} from 'redux';

// used to store quotes associated with their account for the employer that is logged in to view
const employerQuotesReducer = (state = [], action) => {
   switch (action.type) {
     case 'QUOTES':
       return action.payload;
     default:
       return state;
   }
 };

// Used to store quotes associated with their account for the provider that is logged in to view
const providerQuotesReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_QUOTES':
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    employerQuotesReducer,
    providerQuotesReducer,
});
