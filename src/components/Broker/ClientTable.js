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
import moment from 'moment';
import SendToProvider from './SendToProvider';
import AddClient from './AddClient';

//styles for table
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

class ClientTable extends Component {

  componentDidMount = () => {
    this.getClients();
  }

  //gets client information from database
  getClients = () => {
    this.props.dispatch( { type: 'FETCH_CLIENTS', payload: this.props.reduxState.user.company_id } );
    //this.props.dispatch( { type: 'FETCH_PROVIDERS' } );
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
                <TableCell>Status</TableCell>
                <TableCell>Send to Provider</TableCell>
                <TableCell date>Date Employer Added</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* maps through information pulled from database to make table */}
              {this.props.reduxState.deals.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                    {row.name}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell><SendToProvider deal={row}/></TableCell>
                    {/* <TableCell><button>Send To Provider</button></TableCell> */}
                    <TableCell>{moment(row.date_email_sent_to_employer).format('MMMM Do YYYY')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        <AddClient AddClient= {this.AddClient}/>
      </div>
    );
  }
}


const mapStateToProps = reduxState => ({
  reduxState
});

ClientTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(ClientTable));