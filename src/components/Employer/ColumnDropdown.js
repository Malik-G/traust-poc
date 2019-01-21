// Vendors
import React, {Component} from 'react';
import { connect } from 'react-redux';
// Styles
import { withStyles } from '@material-ui/core/styles';
// import ReactDOM from 'react-dom';
// import { withStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// Material UI styling and theme setup (CSS)
const styling = theme => ({
   root: {
      display: 'flex',
      flexWrap: 'wrap',
   },
   formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
   },
   selectEmpty: {
      marginTop: theme.spacing.unit * 2,
   },
   alignCenter: {
      textAlign: 'center'
   },
});

class ColumnDropdown extends Component {

   // Creates local state to store the user's currently selected option
   // This is used to populate the dropdown when it's not in use- showing the choice the user selected
   state = {
      label: '',
    };
    
    // This function takes in the option from the dropdown menu that the user picked and sets it to local state
    // as well as sends the user's choice to the columns reducer stored in redux for later
    handleChange = (name) => event => {
      this.props.dispatch({type: 'SET_COLUMNS', payload: [this.props.index, event.target.value]})
      this.props.renderFunction();
      this.setState({ label: event.target.value });
    };
   
   render(){
     
      return(
         
         <div>

            <FormControl  variant="filled" className={this.props.formControl}>
               <InputLabel htmlFor="filled-label-native-simple"></InputLabel>
               <Select
                  
                  native
                  value={this.state.label}
                  onChange={this.handleChange()}
                  input={<FilledInput name="label" id="filled-label-native-simple" />}
               >
                  {/* These options are hard coded (manually written) for this version- based on scope document requirements. */}
                  <option key='default' disabled={true} value="">Select Column Label</option>
                  <option value='employer_supplied_unique_id'>Employee's Unique ID</option>
                  <option value='date_of_birth'>Employee's Date of Birth</option>
                  <option value='date_of_hire'>Employee's Date of Hire</option>
                  <option value='union'>Union or Non-Union</option>
                  <option value='salary_per_year'>Employee's Salary</option>
                  <option value='gender'>Employee's Gender</option>
                  <option value='status'>Employment Status (retired, active, LOA, etc.)</option>
                  <option value='state'>Employee's State of Residence</option>
                  <option value='role'>Employee's Role</option>
                  <option value='employer_supplied_company_code'>Company Code</option>
                  <option value='other'>Other</option>
               </Select>
            </FormControl>
         </div>
      );
   }
}

const mapStateToProps = state => ({
   columnsReducer: state.columnsReducer
});

export default connect(mapStateToProps)(withStyles(styling)(ColumnDropdown));