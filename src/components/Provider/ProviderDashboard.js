// Vendors
import React, { Component } from 'react';
import {connect} from 'react-redux';
// Components
import CustomizedTable from './CustomizedTable';
// styling
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

// Material UI theme and component styling (CSS)
const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: 100,
    marginRight: 100,
    overflowX: 'auto',
  },
});

class ProviderDashboard extends Component {

  fetchQuotes = () => {
    // Dispatch action to fetch the Quotes from the server
    this.props.dispatch( { type: 'FETCH_QUOTES' } );
  }

  // This renders the Quotes right away
  componentDidMount() {
      this.fetchQuotes();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={15}>
          <h1>Your Dashboard</h1>
          <CustomizedTable quote={this.props.reduxState.quotesReducer.providerQuotesReducer}/>
        </Paper>
      </div>
    );
  }
}


const mapStateToProps = reduxState => ({reduxState});

export default withStyles(styles)(connect(mapStateToProps)(ProviderDashboard));