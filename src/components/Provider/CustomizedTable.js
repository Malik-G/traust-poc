// Vendors
import React from 'react';
import PropTypes from 'prop-types';
// Components
import UploadQuoteButton from './UploadQuoteButton';
// Styles
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CheckCircle from '@material-ui/icons/CheckCircle';
import NotInterested from '@material-ui/icons/NotInterested';

// Material UI theme and styling
const theme2 = createMuiTheme({
  palette: {
    primary: {
        main: `#1a3d50`,
      },
    secondary: {
      main: `#efbf42`,
    },
  },
 });

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: `#1a3d50`,
    color: theme.palette.common.white,
    // text: center,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

// This function checks to see if a response has been sent to the Employer.
function statusMath(status) {
  // If the Provider has sent a response, add a checkmark icon to the table.
  if (status === true) {
      return(
          <CheckCircle />
      )
  }
  // If the Provider has not responded, add a "no" symbol icon to the table.
  else{
      return(
          <NotInterested />
      )
  }    
}


function CustomizedTable(props) {
  const { classes } = props;

  return (
    <MuiThemeProvider theme={theme2}>
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Employer</CustomTableCell>
            <CustomTableCell>Broker</CustomTableCell>
            <CustomTableCell>Download Employer's Data</CustomTableCell>
            <CustomTableCell>Response Status</CustomTableCell>
            <CustomTableCell>Respond</CustomTableCell>
          </TableRow>
        </TableHead>
        {/* Map through the quotes that are associated with the logged-in provider.
        For each quote, add a row to the dashboard table for organization. */}
        <TableBody>
          {props.quote.map(quote => {
            return (
              <TableRow className={classes.row} key={quote.quote_id}>
                <CustomTableCell component="th" scope="quote">
                  {quote.employer}
                </CustomTableCell>
                <CustomTableCell>{quote.broker}</CustomTableCell>
                <CustomTableCell className="icon" onClick={()=> window.open(quote.csv_url, "_blank")}><CloudDownload /></CustomTableCell>
                <CustomTableCell>{statusMath(quote.decision_complete)}</CustomTableCell>
                <CustomTableCell>
                  <UploadQuoteButton quote_id={quote.quote_id} employer={quote.employer}/>
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
    </MuiThemeProvider>
  );
}

CustomizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};
// ContainedButtons.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(CustomizedTable);