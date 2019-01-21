import React from 'react';
import {Route} from 'react-router-dom'
import {connect} from 'react-redux';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';

// A Custom Wrapper Component -- This will keep our code DRY.
// Responsible for watching redux state, and returning an appropriate component
// API for this component is the same as a regular route

// THIS IS NOT SECURITY! That must be done on the server
// A malicious user could change the code and see any view
// so your server-side route must implement real security
// by checking req.isAuthenticated for authentication
// and by checking req.user for authorization

const ProtectedRoute = (props) => {
  // Using destructuring, this takes ComponentToProtect from component
  // prop and grabs all other props to pass them along to Route
  const {
    // Alias prop 'component' as 'ComponentToProtect'
    // the component the admin sees when they log in
    component: ComponentToProtect,
    // the component the provider sees when they log in
    component2: ComponentToProtect2,
    // the component the broker sees when they log in
    component3: ComponentToProtect3,
    // the component the empolyer sees when they log in
    component4: ComponentToProtect4,
    user,
    loginMode,
    ...otherProps
  } = props;

  let ComponentToShow;

   // only show routes to corresponding authorization_id
   // component Admin sees when they log in
  if (user.user_id && user.authorization_id === 1) {
     // if the user is logged in (only logged in users have ids)
     // show the component that is protected
     ComponentToShow = ComponentToProtect;
  // component Provider sees when they log in
  } else if (user.user_id && user.authorization_id === 2) {
     // if the user is logged in (only logged in users have ids)
     // show the component that is protected
     ComponentToShow = ComponentToProtect2;
  // component Broker sees when they log in
  } else if (user.user_id && user.authorization_id === 3) {
    // if the user is logged in (only logged in users have ids)
    // show the component that is protected
    ComponentToShow = ComponentToProtect3;
    // component Employer sees when they log in
  } else if (user.user_id && user.authorization_id === 4) {
    // if the user is logged in (only logged in users have ids)
    // show the component that is protected
    ComponentToShow = ComponentToProtect4;
  } else if (loginMode === 'login') {
    // if they are not logged in, check the loginMode on Redux State
    // if the mode is 'login', show the LoginPage
    ComponentToShow = LoginPage;
  } else {
    // the the user is not logged in and the mode is not 'login'
    // show the RegisterPage
    ComponentToShow = RegisterPage;
  }

  // We return a Route component that gets added to our list of routes
  return (
      <Route
        // all props like 'exact' and 'path' that were passed in
        // are now passed along to the 'Route' Component
        {...otherProps}
        component={ComponentToShow}
      />
  )
}

// Instead of taking everything from state, we just want the user and loginMode
// to determine which page we should show the user
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user, loginMode }) => ({ user, loginMode });
const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginMode: state.loginMode,
  }
}

export default connect(mapStateToProps)(ProtectedRoute)


