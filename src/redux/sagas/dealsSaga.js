import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

function* getDealId(action) {
   try {
      const response = yield call(axios.get, `/api/company_id/deals/${action.payload}`);
      yield put({type: 'SET_DEALS', payload: response.data});  
   }
   catch (error) {
       console.log(`GET request to /api/company_id/deals/${action.payload.deal_id} UNSUCCESSFUL...`);
   }
}

function* getCsvUrl(action) {
   try {
      const response = yield call(axios.get, `/api/deals/csv/${action.payload}`);
      console.log('RESPONSE.DATA: ', response.data)
      yield put({type: 'SET_DEALS', payload: response.data});  
   }
   catch (error) {
       console.log(`GET request to /api/deals/csv/${action.payload.deal_id} UNSUCCESSFUL...`);
   }
}

function* updateCsvUrl(action) {
  console.log('Send CSV url to typesReducer??  dispatch: UPDATE_CSV_URL, function: updateCsvUrl, file: dealsSaga', 'action.payload: ', action.payload);
   try {
      const response = yield call(axios.put, `/api/deals/${action.payload.deal_id}`, action.payload);
      console.log('put, type: QUOTES, currently disabled')
      // yield put({type: 'QUOTES', payload: response.data});  
   }
   catch (error) {
       console.log(`GET request to /api/deals/${action.payload.deal_id} UNSUCCESSFUL...`);
   }
}

function* getDeals(action) {
  console.log('Get deals from server for dealsReducer.  dispatch: FETCH_CLIENTS, function: getDeals, file: dealsSaga', 'action.payload: ', action.payload);
   const reqId = action.payload;
   try {
     const config = {
       headers: { 'Content-Type': 'application/json' },
       withCredentials: true,
     };
     const response = yield axios.get(`api/deals/clienttable/${reqId}`, config);
     yield put({ type: 'SET_DEALS', payload: response.data });
   } 
   catch (error) {
     console.log('Deals get request failed', error);
   }
 }

function* dealsSaga() {
   yield takeLatest('GET_DEAL_ID', getDealId);
   yield takeLatest('GET_CSV_URL', getCsvUrl);
   yield takeLatest('UPDATE_CSV_URL', updateCsvUrl); 
   yield takeLatest('FETCH_CLIENTS', getDeals);
 }
 
 export default dealsSaga;