const employeesReducer = (state = [], action) => {
   switch (action.type) {
      case 'EMPLOYEE_DATA':
         return action.payload
      default:
         return state;
   }
};

export default employeesReducer;