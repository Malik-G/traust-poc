import React, { Component } from 'react';
import {connect} from 'react-redux';
import {storage} from '../../firebase/config';
import { withStyles } from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import swal from 'sweetalert';

const styling = theme => ({
   csvButton: {
      background: 'royalblue',
      color: 'white',
      textWeight: 'bold',
      textTransform: 'uppercase'
   },
   dialogCancelBtn: {
      background: 'firebrick',
      color: 'white',
      textWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 12
   },
   dialogConfirmBtn: {
      background: 'green',
      color: 'white',
      textWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 12
   }
})

const newState = {
   deal_id: null,
   csvFile: null,
   csv_url: null,
   open: false,
   disableButton: true
}

class FileUpload extends Component {

   state = newState;

   handleOpenClick = () => {
      this.setState({
         open: true,
         deal_id: this.props.deal_id.deal_id //the first 'deal_id' is the name of the parent component prop
      });
   };
  
   handleCloseClick = () => {
      this.setState({ open: false });
   };
   
   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   }

   selectImage = (event) => {
      if (event.target.files[0]) {
         const targetCsv = event.target.files[0]
         console.log(event.target.files)
         this.setState({csvFile: targetCsv,})
      }
   }

   uploadCsv = () => {
      console.log(this.state);
      if(this.state.csvFile === null){
         swal( "Wait", "Please select a csv file locally from your computer...", "warning");
         return
      }
      //ref has a function called put
      const uploadTask = storage.ref(`employer_files/${this.state.csvFile.name}`).put(this.state.csvFile);
      //uploadTask.on('state_changed', progess, error, complete) //this is the format of the parameters, they are functions;
      uploadTask.on('state_changed',
      (snapshot) => {
         //progress function parameter
         const thisProgess = Math.round((snapshot.bytesTransferred / snapshot.totalBytes * 100)); //snapshot has a property of bytesTransferred
         this.setState({progress: thisProgess});
      },
      (error) => {
         //error function parameter
         console.log(`The error:, `, error)
      },
      (complete) => {
         //complete function parameter
         storage.ref('employer_files').child(this.state.csvFile.name).getDownloadURL().then(thisUrl => {
            console.log(thisUrl);
            swal("Uploaded!", "File successfully uploaded!", "success");
            this.setState({
               csv_url: thisUrl,
               disableButton: false
            });
            this.props.dispatch({type: 'UPDATE_CSV_URL', payload: this.state})
         })
         .then((result)=>{
            this.updateUrl()
         })
      });
   }
   
   updateUrl = () => {
      this.props.dispatch({type: 'EXTRACT_EMPLOYEE_DATA', payload: this.props.user.company_id})
      this.props.history.push('/data-table')
      this.setState(newState);
   }

   render() {
    
      const {classes} = this.props;
      console.log(this.state);
      
      // let confirmButton = this.state.disableButton === true ?
      // <Button type="submit" className={classes.dialogConfirmBtn} variant="contained" disabled>Confirm</Button>
      // : <Button onClick={this.updateUrl} className={classes.dialogConfirmBtn} variant="contained">Confirm</Button>

      return (
         <section>
            <div>
               <Button onClick={this.handleOpenClick} className={classes.csvButton} variant="contained">Upload csv</Button>
            </div>
            <Dialog
               open={this.state.open}
               onClose={this.handleCloseClick}
               aria-labelledby="dialog-title"
            >
            <DialogTitle id="dialog-title">Upload a .csv file</DialogTitle>
            <DialogContent>
               <DialogContentText>1. Click the "Choose File" button below.<br/>2. Choose the .csv file from your computer that has your employees' data.<br/>3. Click the "Upload" button at the bottom to load your data.<br/>4. You will be brought to a new page where you will organize your data.</DialogContentText>
                  <br/>
                     <FormGroup>
                        <FormControl >
                           <input  type="file" accept=".csv" onChange={this.selectImage}/>
                           <br/>
                           {/* <div>
                              <img src={this.state.csv_url || 'https://via.placeholder.com/280x200'} alt="Upload image" height="280" width="200"></img>
                           </div> */}
                        </FormControl>
                     </FormGroup>
                  
            </DialogContent>
            <DialogActions>
               {/* {confirmButton} */}
               <Button onClick={this.uploadCsv} className={classes.csvButton}>Upload</Button>
               <Button onClick={this.handleCloseClick} className={classes.dialogCancelBtn} variant="contained">Cancel</Button>
            </DialogActions>
         </Dialog>
         </section>
      );
   }
}


const mapStateToProps = reduxState => {
  return reduxState
};

export default withRouter(connect(mapStateToProps)(withStyles(styling)(FileUpload)));