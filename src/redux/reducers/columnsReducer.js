// This reducer stores the employer's selected dropdown menu values that they choose during the csv file sorting process.
const columnsReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_COLUMNS':
         if(state.length === 0){
            for(let i = 0; i < action.payload; i++){
               state = [...state, 'choose']
            }
            return state
         }   
         else {
            state[action.payload[0]] = action.payload[1]
            return state
         }
      default:
         return state;
    }
 };
 
 export default columnsReducer;