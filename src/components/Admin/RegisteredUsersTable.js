import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core';


const styles = theme => ({
    containers: {
        display: 'flex',
        justifyContent: 'center',
    },
    table: {
        width: 750,
        marginTop: 40,
        margin: 'auto',
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    header: {
        fontSize: 18,

    }
})

class RegisteredUsersTable extends Component {

  render() {
    // material ui
    const {classes} = this.props

    return (
      <div>
         <h1>Registered Users</h1>
        <Paper className={classes.table} >
        <Table >
          <TableHead>
            <TableRow >
              <TableCell className={classes.header}>Username</TableCell>
              <TableCell className={classes.header}>Company Name</TableCell>
            </TableRow>
          </TableHead>
        {this.props.userList.map( user => {
          return(
            <TableRow className={classes.row} key={user.company_name} >
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.company_name}</TableCell>
            </TableRow>
          )
        })}
        </Table>
        </Paper>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapreduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapreduxStateToProps)(withStyles(styles)(RegisteredUsersTable));