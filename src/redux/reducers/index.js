import { combineReducers } from 'redux';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import quotesReducer from './quotesReducer';
import deals from './dealsReducer';
import quotesTableReducer from './quotesTableReducer';
import providerReducer from './providerReducer';
import employeesReducer from './employeesReducer';
import types from './typesReducer';
import columnsReducer from './columnsReducer';
// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  loginMode, // will have a value of 'login' or 'registration' to control which screen is shown
  user, // will have an id and username if someone is logged in
  types, 
  deals, //gets deals for broker clients table
  quotesTableReducer, // gets quotes table info
  quotesReducer, // fetches and stores the quotes
  providerReducer,
  employeesReducer,
  columnsReducer, // stores the table columns and their titles
});

export default rootReducer;
