import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import swal from 'sweetalert';


const styling = theme => ({
   sizeImg: {
      height: 280,
      width: 200
   },
   inlineBlock:{
      float: 'left',
   },
   customBtn: {
      height: 10,
      width: 80,
      fontWeight: 'bold',
      fontSize: 10,
      color: 'white'
   },
   backgroundGray: {
      background: 'dimgray'
   },
   backgroundGreen: {
      background: 'forestgreen'
   },
   sendBtn: {
      width: 100,
      background: 'royalblue'
   },
})

const newState = {
   open: false,
   confirmBtn: false,
   sendBtn: false,
   providerObj: {},
   
}

class SendToProvider extends Component {

   state = newState;
  
   componentDidMount(){
      this.setProviders();
      //  this.props.dispatch( { type: 'FETCH_PROVIDERS' } );
   }

   //function to populate this component's state with all of the providers
   setProviders = () => {
      let theProviderObj = {};
       for(let provider of this.props.providerReducer.providerReducer){
         console.log("provider in for loop: ", provider);
          theProviderObj[provider.name] = null;
       }
       console.log(theProviderObj)
       this.setState({
          providerObj: theProviderObj
       })
   }
   
   handleOpenClick = () => {
      this.setState({open: true});
   };
  
   handleCloseClick = () => {
      this.setState({open: false, confirmBtn: false});
   };
   
   handleChange = (event) => {
      if (this.state.providerObj[event.target.name] === null){
         this.setState({
            confirmBtn: true,
            providerObj: {
               ...this.state.providerObj,
               [event.target.name]: event.target.value
            },
         });
      }
      else {
         this.setState({
            confirmBtn: true,
            providerObj: {
               ...this.state.providerObj,
               [event.target.name]: null
            },
         });
      }
   }

   postQuote = () => {
      let providerObjectArray = [];
      for( let provider of this.props.providerReducer.providerReducer) {
         console.log("this.state.providerObj[name]: ", this.state.providerObj[provider.name])
         if (this.state.providerObj[provider.name] === "sendTo") {
            console.log("name equaled sendTo");
            console.log("PROPS", this.props);
            console.log("this.props.deal.deal_id: ", this.props.deal.deal_id)
            provider.deal_id = this.props.deal.deal_id;
            
            providerObjectArray.push(provider);
         }
      }  //  End for loop
      console.log("providerObjectArray: ", providerObjectArray)
      this.props.dispatch({type: "POST_QUOTE", payload: providerObjectArray })
   } //  end postQuote

   confirmUpdate = () => {
      let providerObjValues = Object.values(this.state.providerObj)
      if(providerObjValues.includes("sendTo") === false){
         swal("WAIT!", "Please select at least 1 provider", "warning")
      }
      else {
         swal({
            title: "Are these the correct providers?",
            icon: "info",
            buttons: [ "No", "Yes"]
            })
         .then((willConfrim)=>{
            if(willConfrim){
               this.postQuote();
               swal("Successfully sent!", {icon: "success"});
               this.setState({open: false, confirmBtn: false});
            }
            else {
               swal("Double check your selections")
            }
         });
      }
   }

   render(){
      
      const {classes} = this.props;
      let checkBoxes; // will be used in the JSX
      console.log(this.state);
      
      //loop through theProviderObj in state to get it's keys, a.k.a the provider names
      if (this.state.providerObj){
         let providerObjKeys = Object.keys(this.state.providerObj)
         console.log (providerObjKeys);
         checkBoxes = providerObjKeys.map( provider => <div>
           <FormControlLabel
               control={<Checkbox checked={this.state.providerObj.provider} onChange={this.handleChange} value="sendTo" />}
               label={provider}
               name={provider}
            /> </div>
         )
      }
      // Conditional rendering to keep the "Add Card" button disabled until the form is completed
      let confirmBtn = this.state.confirmBtn === false ?
      <Button variant="contained" className={classes.customBtn} disabled>Confirm</Button>
      : <Button onClick={this.confirmUpdate} variant="contained"  className={`${classes.customBtn} ${classes.backgroundGreen}`}>Confirm</Button>
      
      return(
         <section>
            <div className={classes.alignCenter}>
               <Button onClick={this.handleOpenClick} className={ `${classes.customBtn} ${classes.backgroundGray}`} variant="contained">Select</Button>
            </div>
            <Dialog
               open={this.state.open}
               onClose={this.handleCloseClick}
               aria-labelledby="dialog-title"
            >
               <DialogTitle id="dialog-title">Send to Providers</DialogTitle>
               <DialogContent>
                  <DialogContentText>Which providers would you like to send this client's data to?</DialogContentText>
                     <FormGroup>
                        <FormControl >
                           <div className={classes.inlineBlock}>
                              {checkBoxes}
                           </div>
                        </FormControl>
                     </FormGroup>
               </DialogContent>
               <DialogActions>
                  {confirmBtn}
                  <Button onClick={this.handleCloseClick} className={`${classes.customBtn} ${classes.backgroundGray}`} >Cancel</Button>
               </DialogActions>
            </Dialog>
         </section>
      );
   }
}

/* {this.props.portfolioReducer.map( (card) => (
               <div>
                  <img src={card.image_url}/>
               </div>
            ))} */

const mapStateToProps = state => ({
   portfolioReducer: state.portfolioReducer,
   user: state.user,
   providerReducer: state.providerReducer
   //communityReducer: state.communityReducer
});

export default connect(mapStateToProps)(withStyles(styling)(SendToProvider));