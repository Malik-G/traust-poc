import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

function* fetchProvidersSaga(action) {
    console.log('Get providers from server for providerReducer.   dispatch: FETCH_PROVIDERS, function: fetchProvidersSaga, file: providerSaga', 'action.payload: ', action.payload);
    try {
        const response = yield call( axios.get, '/api/quotes/providers' );
        console.log("in fetchProviderSaga, response.data: ", response.data)
        yield put( { type: 'SET_PROVIDERS', payload: response.data } );
    }
    catch (error) {
        console.log('Error with Providers DB GET request:', error);
    }
}

function* providersSaga() {
    yield takeEvery('FETCH_PROVIDERS', fetchProvidersSaga);
  }
  
  export default providersSaga;