// Vendors
import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {connect} from 'react-redux';
// Components
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
// Component Pages
import AdminDashboard from '../Admin/AdminDashboard';
import BrokerDashboard from '../Broker/BrokerDashboard';
import EmployerDashboard from '../Employer/EmployerDashboard';
import EmployeeDataTable from '../Employer/EmployeeDataTable';
import ProviderDashboard from '../Provider/ProviderDashboard';
import LoginPage from '../LoginPage/LoginPage';
import AboutPage from '../AboutPage/AboutPage';

// Styles
import './App.css';


class App extends Component {
  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            <Route
              exact
              path="/about"
              component={AboutPage}
            />
            <Route
              exact
              path="/"
              component={LoginPage}
            />
            <Route
              exact
              path="/brokerdashboard"
              component={BrokerDashboard}
              />
            <Route
              exact
              path="/dashboard"
              component={ProviderDashboard}
            />
            <Route
              exact
              path="/data-table"
              component={EmployeeDataTable}
            />
            
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedRoute
              exact
              path="/home"
              // the component the admin sees when they log in with authorization_id = 1
              component={AdminDashboard}
              // the component the provider sees when they log in  with authorization_id = 2
              component2={EmployerDashboard}
              // the component the broker sees when they log in  with authorization_id = 3
              component3={BrokerDashboard}
              // the component the employer sees when they log in  with authorization_id = 4
              component4={ProviderDashboard}
            />
            {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
            {/* <ProtectedRoute
              exact
              path="/info"
              component={InfoPage}
            /> */}
            
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
  )}
}

export default connect()(App);
