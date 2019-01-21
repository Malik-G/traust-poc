import React, { Component } from 'react';
import {connect} from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import { TextField } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import swal from 'sweetalert';
import RegisteredUsersTable from './RegisteredUsersTable';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  //styling for create new user
  root: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: '30%',
    marginRight: '30%',
    overflowX: 'auto',
  },
  //styling for user table
  table: {
    marginTop: theme.spacing.unit * 7,
    marginLeft: '20%',
    marginRight: '20%',
    overflowX: 'auto',
  },
});

class ProviderBrokerRegisterPage extends Component {

  // run as soon as possible 
  componentDidMount() {
    //get authorization types
    this.getAuthorization();
    // get users for table 
    this.getUsers();

  }

  // get users created by admin
   getUsers = () => {
     axios.get('/users').then(response => {
        this.setState({
        userList: response.data
      })
     }).catch(error => {
       alert('Error making/ users GET request', error);
     })
   }

  state = {
    authorization_id: 0,
    company_name: '',
    username: '',
    password: '',
    // controls menu
    anchorEl: null,
    selected: '',
    name: this.props.reduxState.user.name,
    userList: []
  };

    // sends email information to nodemailer reducer
    handleEmailSend(e) {
      axios({
        method: "POST",
        url: "/send",
        data: {
        // email broker, provider, or admin their login information
        // email sent to the email provided as the username email
            name: this.state.name,
            username: this.state.username,
            password: this.state.password
        }
      }).then((response) => {
        if (response.data.msg === 'success') {
          swal("Great job!", "Registration Successful!! Email Sent!!", "success");
            // get users after adding them
            this.getUsers();
        } else if (response.data.msg === 'fail') {
          swal("WARNING!", "Email failed to send.", "warning");
        }
      })
    }

  // getProject dispatches a call to get authorization authorization level names and ids
  getAuthorization = (event) => {
    // dispatch to adminSaga
    this.props.dispatch({type: 'GET_AUTHORIZATION'});
  }

   // controls menu
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  // controls and captures menu selection
  handleClose = (event) => {
    // menu item text
    console.log("handleClose event.target.value: ", event.target.value);
    this.setState({ authorization_id: event.target.value,
    selected: event.target.innerText
    });
    // menu control 
    this.setState({ anchorEl: null });
  };
  
  // registration 
  registerUser = (event) => {
    event.preventDefault();
    console.log('entered registerUser', this.state)
    if (this.state.authorization_id && this.state.company_name && this.state.username && this.state.password) {

      // dispatch to registrationSaga
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          authorization_id: this.state.authorization_id,
          company_name: this.state.company_name,
          username: this.state.username,
          password: this.state.password,
        },
      });
         // send email with login info to broker, provider, or admin
         this.handleEmailSend();
    }  else {
      this.props.dispatch({type: 'REGISTRATION_INPUT_ERROR'});
    }
         // clear input feilds 
         this.setState({
           authorization_id: 0,
           company_name: '',
           username: '',
           password: '',
           selected: ''
         });
  } 

  // captures textFeild input and sets it in state
  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    // controls menu
    const { anchorEl } = this.state; 
    // class for paper
    const { classes } = this.props;
    return (
      <div>
        {/* paper to put create new user on a card */}
        <Paper className={classes.root} elevation={15}>
        <h1>Register Users</h1>
      <div>
        <form onSubmit={this.registerUser}>
            <div>
          </div>
          <div>
            
          <Button
            variant="raised"
            color = "primary"
            className = "link-button"
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}>
            {/* The following three lines decide the text of the button options */}
            {this.state.authorization_id === 0 && "Select User Type"}
            {this.state.authorization_id === undefined && "Select User Type"}
            {this.state.authorization_id != undefined && this.state.selected}
          </Button>
         
          <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              >
               {this.props.reduxState.types.map( authorization =>
          <MenuItem 
              key={authorization.authorization_id}
              value={authorization.authorization_id} 
              name={authorization.type_of_company} 
              onClick={this.handleClose}>
              {authorization.type_of_company}
          </MenuItem>
            )}
          </Menu>
          </div>
          
          <div>
            <InputLabel htmlFor="company_name"></InputLabel>
              <TextField
                id="company_name-input"
                label = "Company Name"
                type="text"
                name="company_name"
                value={this.state.company_name}
                onChange={this.handleInputChangeFor('company_name')}
              />
          </div>
          <div>
            <InputLabel htmlFor="email"></InputLabel>
              <TextField
                id="email-input"
                label = "Email"
                type="text"
                name="email"
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
              />
          </div>
          <div>
            < InputLabel htmlFor = "password"></InputLabel> 
              <TextField
                id="password-input"
                label = "Password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
          </div>
                {/* only render input button when an authorization is selected */}
              {  this.state.authorization_id != undefined && this.state.authorization_id != 0 &&
            <input
              className="register"
              type="submit"
              name="submit"
              value="Register"
            />
              }
        </form>
      </div>
      </Paper>
      {/* paper to put user list on a card */}
      <Paper className={classes.table} elevation={15}>
        {/* userList gets passed to RegisteredUsersTable */}
        <RegisteredUsersTable userList = {this.state.userList}/>
      </Paper>
      </div>
    );
  }
}

const mapreduxStateToProps = reduxState => ({
  reduxState,
});

export default withStyles(styles)(connect(mapreduxStateToProps)(ProviderBrokerRegisterPage));

