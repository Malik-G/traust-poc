// Vendors
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {storage} from '../../firebase/config';
import swal from 'sweetalert';
// Styles
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Send from '@material-ui/icons/Send';

// Material UI theme and component styling (CSS)
const styling = theme => ({
   root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
   fileButton: {
      background: `#1a3d50`,
      color: 'white',
      margin: theme.spacing.unit,
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

// A template object to use for resetting state
const newState = {
   quote_id: null,
   file: null,
   file_url: null,
   open: false,
   disableButton: true,
   message: '',
}

class UploadQuoteButton extends Component {

   // Sets state to the template object above
   state = newState;

   // Updates State to include the quote's ID for updates
   componentDidMount = () => {
      this.setState({
         quote_id: this.props.quote_id,
      });
   };

   // Handles the popup window
   handleOpenClick = () => {
      this.setState({ open: true });
   };
  
   // Handles the popup window
   handleCloseClick = () => {
      this.setState({ open: false });
   };
   
   // This function takes what the user types in the "Provider Response Form" 
   // and sets it with local state so we can use the information to export later
   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   }

   // Handles the "quote file" upload and sets it inside local state
   selectImage = (event) => {
      if (event.target.files[0]) {
         const targetFile = event.target.files[0]
         this.setState({file: targetFile,})
      }
   }

   // This function takes the data that the user has input and checks if all the required fields are filled.
   // If all the required fields are filled, this function will upload the file to the FireBase database
   // and add that URL (link) along with the Provider's message to the database via calling the updateUrl function below.
   uploadFile = () => {
      this.setState({
         quote_id: this.props.quote_id,
      });
      if(this.state.file === null){
         swal("WARNING!", "Please select a file locally from your computer!", "warning");
         return
      }
      // This creates the URL that the file will be stored at on FireBase
      const uploadTask = storage.ref(`provider_files/${this.props.reduxState.user.company_id}/${this.props.quote_id}/${this.state.file.name}`).put(this.state.file);
      uploadTask.on('state_changed',
         (snapshot) => {
         },
         (error) => {
            console.log(`The error:, `, error)
         },
         (complete) => {
            // This triggers when the URL is successfully created, and responds back with the complete URL labeled here as "thisUrl"
            storage.ref(`provider_files/${this.props.reduxState.user.company_id}/${this.props.quote_id}`).child(this.state.file.name).getDownloadURL().then(thisUrl => {
               swal("Great job!", "File successfully uploaded!", "success");
               // Sets local state to include the new file URL
               this.setState({
                  file_url: thisUrl,
                  disableButton: false
               });
            })
            .then((result) => {
               this.updateUrl();
            })
            .catch((error) => {
               console.log('Error with uploadFile function after complete');
            });
         } // end (complete)
      ) // end uploadTask.on
   }
   
   // This function takes the data within local state (the provider's response and/or quote)
   // and dispatches the data as a payload to the quotesSaga.js file.
   updateUrl = () => {
      this.props.dispatch({type: 'UPDATE_QUOTE_URL', payload: this.state})
      this.setState(newState);
   }

   render() {
    
      const {classes} = this.props;
      
      return (
         <section>
            <div>
               <Button onClick={this.handleOpenClick} className={classes.fileButton} variant="contained"><Send /> Send Quote</Button>
            </div>
            <Dialog
               open={this.state.open}
               onClose={this.handleCloseClick}
               aria-labelledby="dialog-title"
            >
            <DialogTitle id="dialog-title">Send a Quote to {this.props.employer}.</DialogTitle>
            <DialogContent>
               <DialogContentText>1. Click the "Choose File" button to upload your document.<br/>2. Enter your message.<br/>3. Click the Send button.
               </DialogContentText>
                     <FormGroup>
                        <FormControl >
                           <br/>
                           <label >File:</label>
                           <input className="fileButton" type="file" onChange={this.selectImage}/>
                           <br/>
                           <label >Your Message:</label>
                           <input rows="6" type='textarea' id="message" placeholder="" value={this.state.message} name="message" onChange={this.handleChange} />
                           <br/>
                        </FormControl>
                     </FormGroup>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.uploadFile} className={classes.fileButton}>Send</Button>
               <Button onClick={this.handleCloseClick} className={classes.dialogCancelBtn} variant="contained">Cancel</Button>
            </DialogActions>
         </Dialog>
         </section>
      );
   }
}


const mapreduxStateToProps = reduxState => ({
  reduxState
});

export default connect(mapreduxStateToProps)(withStyles(styling)(UploadQuoteButton));