// Vendors
import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';
// Styles
import InputLabel from '@material-ui/core/InputLabel';
import { TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '30%',
    margin: '35%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

class AddClient extends Component {

  state = {
    authorization_id: 2,
    company_name: '',
    username: '',
    password: '',
    name: this.props.reduxState.user.name,
    broker_id: this.props.reduxState.user.company_id,
  };

  // sends email information to nodemailer reducer
  handleEmailSend(e){
    axios({
      method: 'POST', 
      url: '/send', 
      data: {
        // email Employer their login information along with broker company name who registered them
        // the email is sent to the username email provided
        name: this.state.name,
        username: this.state.username,
        password: this.state.password
      }
    }).then((response)=>{
      if (response.data.msg === 'success'){
        swal("Great job!", "Registration Successful!! Email Sent!!", "success");
        this.clearInputs();
        this.getClients();
      }
      else if(response.data.msg === 'fail'){
        swal("WARNING!", "Email failed to send.", "warning");
      }
    })
  }

  // registration for Employer
  registerUser = (event) => {
    event.preventDefault();
    if (this.state.company_name === '' || this.state.username === '' || this.state.password === ''){
      swal("WARNING!", "You must fill out every field in the form.", "warning");
    }
    else{
      // console.log('Fields are filled (should be) dispatching to register...');
      // dispatch to registrationSaga
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          authorization_id: this.state.authorization_id,
          company_name: this.state.company_name,
          username: this.state.username,
          password: this.state.password,
          broker_id: this.props.reduxState.user.company_id
        },
      });
      // send Employer an email with their login information 
      this.handleEmailSend();     
    }
  }

    //gets client information from database
    getClients = () => {
      this.props.dispatch({
        type: 'FETCH_CLIENTS',
        payload: this.props.reduxState.user.company_id
      });
    }

  // clear input feilds
  clearInputs = () =>{
    this.setState({
      authorization_id: 2,
      company_name: '',
      username: '',
      password: '',
      user_id: this.props.reduxState.user.user_id
    });
  }

  // captures textFeild input and sets it in state
  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={15}>
        <div align="center">
        <h1>Add a New Employer</h1>
        </div>
        <form onSubmit={this.registerUser}>
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
            <InputLabel htmlFor = "password"></InputLabel> 
              <TextField
                id="password-input"
                label = "Password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
          </div>
            <input
              className="register"
              type="submit"
              name="submit"
              value="Register"
            />
        </form>
        </Paper>
      </div>
    );
  }
}

const mapreduxStateToProps = reduxState => ({
  reduxState,
});

export default withStyles(styles)(connect(mapreduxStateToProps)(AddClient));

