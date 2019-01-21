import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckCircle from '@material-ui/icons/CheckCircle';
import NotInterested from '@material-ui/icons/NotInterested';
import moment from 'moment';

//styling for tables
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

//functional styling for icons
function statusMath(status) {
  if (status === true) {
      return(
          <CheckCircle />
      )
  }
  else{
      return(
          <NotInterested />
      )
  }    
}

class QuoteTable extends Component {
  componentDidMount = () => {
    this.getQuotes();
  }

  //gets quotes from the database
  getQuotes = () => {
    this.props.dispatch( { type: 'GET_QUOTES_TABLE', payload: this.props.reduxState.user.company_id} );
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={15}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Employer</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell date>Date Sent</TableCell>
                <TableCell>Provider Decision</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* gets quote table data from database to make table */}
              {this.props.reduxState.quotesTableReducer.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                    {row.employer_name}
                    </TableCell>
                    <TableCell>{row.provider_name}</TableCell>
                    <TableCell>{moment(row.date_email_sent_to_employer).format('MMMM Do YYYY')}</TableCell>
                    <TableCell>{statusMath(row.decision_complete)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}


const mapStateToProps = reduxState => ({
  reduxState
});

QuoteTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(QuoteTable));