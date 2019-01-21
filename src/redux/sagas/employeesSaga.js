import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

function* extractEmployeeData(action) {
   console.log('Inside extractEmployeeData, company_id:', action.payload);
   
   try {
      const response = yield call( axios.get, `/api/employees/extract/${action.payload}` );
      console.log("In extractEmployeeData, response.data: ", response.data)
      yield put( { type: 'EMPLOYEE_DATA', payload: response.data } );
   }
   catch (error) {
      console.log('Error in extractEmployeeData:', error);
   }
}

function* getEmployeeData(action) {
   try {
      const response = yield call( axios.get, `/api/employees/fetch` );
      console.log("In getEmployeeData, response.data: ", response.data)
      yield put( { type: 'EMPLOYEE_DATA', payload: response.data } );
   }
   catch (error) {
      console.log('Error in getEmployeeData:', error);
   }
}

function* employeesSaga() {
   yield takeEvery('EXTRACT_EMPLOYEE_DATA', extractEmployeeData);
   yield takeEvery('GET_EMPLOYEE_DATA', getEmployeeData);
}
  
export default employeesSaga;