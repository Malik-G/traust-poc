// Vendors
import React, {Component} from 'react';
import { connect } from 'react-redux';
import {storage} from '../../firebase/config'
import swal from 'sweetalert';
// Styles
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// Components
import ColumnDropdown from './ColumnDropdown'

const styling = theme => ({
   alignCenter: {
      textAlign: 'center'
   },
   tableFormat: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 50,
      maxWidth: 1000
   },
   width: {
      width: 570,
      marginLeft: 'auto',
      marginRight: 'auto'
   },
   //styling for employer column page
   columnPage: {
      marginTop: theme.spacing.unit * 3,
      marginLeft: '2%',
      marginRight: '2%',
      padding: 10,
      overflowX: 'auto',
   },
   //styling for employer columns
   columns: {
      marginTop: theme.spacing.unit * 3,
      marginLeft: '1%',
      marginRight: '1%',
      padding: 10,
      overflowX: 'auto',
   },
   //styling for confirm button
   confirmBtn: {
      background: 'green',
      color: 'white',
      textWeight: 'bold',
      textTransform: 'uppercase',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 30
   }
});

class EmployeeDataTable extends Component {

   state = {
      csv_url: null,
      deal_id: null,
   }

   componentDidMount(){
      this.props.dispatch({type: 'GET_DEAL_ID', payload:this.props.user.company_id})
   }
   
   // triggered after each dropdown selction in the child component, it is re-rendering this component
   renderFunction = () => {
      this.setState({})
   }

   // converts the employer's original csv into a new one, then uploads the new csv to Firebase storage
   confirmColumns = () => {
      if(this.props.columnsReducer.includes('choose')){
         swal("Wait...", "There is at least 1 column that needs to be chosen", "warning")
         return
      }
      
      let indexesToRemove = []
      
      // loops through the columnsReducer and searches for indexes with the value of 'other' (i.e. the indexes that need to be removed)
      for(let i = 0; i < this.props.columnsReducer.length; i++){
         if(this.props.columnsReducer[i] === 'other'){
            indexesToRemove.push(i)
         }
      }
      
      let empReducer = this.props.employeesReducer[0] // an array of arrays, each containing an individual employee's data
      
      // loops through each array inside of empReducer and removes the unwanted indexes, which are indicated by the values of the
      // indexesToRemove array, thus the nested loop iterates through the indexesToRemove array and splices accordingly
      for(let array of empReducer){
         for(var i = indexesToRemove.length-1; i >= 0; i--){
            array.splice(indexesToRemove[i], 1)
         }
      }

      let newCsvBody = ''
      
      // now that every array within the empReducer is modified accordingly, the contents of each array needs to become one long string
      // this long string, newCsvBody, will be used in the creation of a new csv file
      // the nested loop is tasked with putting quotations around each array element followed by a comma so that the csv format is retained
      for(let array of empReducer){
         let arrayToString = ''
         for(let i = 0; i < array.length; i++){
            arrayToString += '"' + array[i] + '",'
         }
         newCsvBody += arrayToString + '\n'
      }
      
      let finalColumnsString = '' // newCsvBody and a modified version of finalColumnsString will be concatenated and stored in finalCsvString
      let finalCsvString = ''     
      
      // loop through the columnsReducer to build a string that will eventually be the new first line of our originalCsvString
      for(let category of this.props.columnsReducer){
         if(category === 'other' || category === 'choose'){
            console.log('No push')
         }
         else {
            finalColumnsString += category + ','
         }
      }
      
      let finalColumnsString2 = finalColumnsString.slice(0, finalColumnsString.length-1) //removes the comma at the end of finalColumnsString
      finalCsvString = finalColumnsString2 + '\n' + newCsvBody
      let contentType = 'text/csv';
      let blobObject = new Blob([finalCsvString], {type: contentType});
         
      //ref has a method called put
      const uploadTask = storage.ref(`updated_employer_files/new_csv_${this.props.user.company_id}.csv`).put(blobObject);
      
      //uploadTask.on('state_changed', progess, error, complete) //this is the format of the parameters, they are functions;
      uploadTask.on('state_changed',
      (snapshot) => {
         //the progress function parameter
      },
      (error) => {
         //the error function parameter
         console.log(`The error:, `, error)
      },
      (complete) => {
         //the complete function parameter
         storage.ref('updated_employer_files').child(`new_csv_${this.props.user.company_id}.csv`).getDownloadURL().then(thisUrl => {
            console.log(thisUrl);
            swal("Uploaded!", "File successfully uploaded!", "success");
            this.setState({
               csv_url: thisUrl,
               deal_id: this.props.deals[0].deal_id
            });
            this.props.dispatch({type: 'UPDATE_CSV_URL', payload: this.state})
            this.props.history.push('/home')
         })
      });
    }
   
   render(){

      const {classes} = this.props
      let preTableInsert;
      let tableHeadInsert;
      let tableBodyInsert1;
      let tableBodyInsert2;
      let confirmButton;
      let columnsArr = []
      if(this.props.employeesReducer.length === 0){
         preTableInsert = <span></span>
         tableHeadInsert = <br></br>
         tableBodyInsert1 = <p className={classes.alignCenter}>Please navigate to the home page by clicking this <a href='/home'>LINK</a> and re-upload your csv file...</p> 
         confirmButton = <span></span>
      }
      if (this.props && this.props.employeesReducer.length > 0 && this.props.columnsReducer.length === 0){
         console.log(this.props.employeesReducer[0].length)
         this.props.dispatch({type:'SET_COLUMNS', payload: this.props.employeesReducer[0][0].length})
      }
      if(this.props && this.props.employeesReducer.length > 0 && this.props.columnsReducer.length > 0){
         
         preTableInsert = <div className={`${classes.width}`}>
            <p>1. This is only a small sample of the data you have uploaded.</p>
            <p>2. Please make sure each column dropdown menu matches the data it belongs to below.</p>
            <p>3. Click the "Confirm" button when all columns are complete to send your data.</p>
         </div>
         
         tableHeadInsert = this.props.employeesReducer[0][0].map((column, index) =>
            <TableCell style={{padding: 5,}}><ColumnDropdown index={index} columnRowLength={null} renderFunction={this.renderFunction}/></TableCell>)
         
         tableBodyInsert1 = <TableRow style={{backgroundColor: '#6B6B6B',}}>
            {this.props.employeesReducer[1][0].map(data => 
               <TableCell style={{padding: 5,color: '#FFFFFF',}}>{data}</TableCell>
            )}
         </TableRow>

         for(let i = 1; columnsArr.length < 5; i++) {
            columnsArr.push(this.props.employeesReducer[0][i])
         }

         tableBodyInsert2 = columnsArr.map(employee =>
            <TableRow style={{backgroundColor:'#828282',}}>
               {employee.map(data => 
                  <TableCell style={{padding: 5,color: '#FFFFFF',}}>{data}</TableCell>
               )}
            </TableRow>);
         
         confirmButton = <div className={classes.alignCenter}>
               <Button className={classes.confirmBtn} onClick={this.confirmColumns}>Confirm</Button>
            </div>
      }
      
      return(
         <div>
            <Paper className={classes.columnPage} elevation={15}>
               <h1>Check Your Data</h1>
               {preTableInsert}
               <Paper className={classes.columns} elevation={2}>
                  <Table>
                     <TableHead>
                        <TableRow>
                           {tableHeadInsert}
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        
                        {tableBodyInsert1}
                        {tableBodyInsert2}
                     </TableBody>
                  </Table>
               </Paper>
            </Paper>
            {confirmButton}
         </div>
      );
   }
}

const mapStateToProps = state => ({
   deals: state.deals,
   employeesReducer: state.employeesReducer,
   user: state.user,
   columnsReducer: state.columnsReducer
});

export default connect(mapStateToProps)(withStyles(styling)(EmployeeDataTable));