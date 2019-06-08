import { takeLatest, put } from "redux-saga/effects";
import * as actions from "../actions";

function* getTranscript(action) {
  try {
    let res = yield fetch(actions.baseUri + "voice", {
      method: "POST",
      body: action.payload
    });
    res = yield res.json();
    if (res && res.data && res.data.length > 0) {
      yield put({ type: actions._GETDATA_SUCCESS, payload: res.data });
    } else {
      yield put({
        type: actions._GETDATA_FAIL,
        payload: "Can't hear you properly!! COuld you please repeat."
      });
    }
  } catch {
    yield put({
      type: actions._GETDATA_FAIL,
      payload: "SERVER ERROR"
    });
  }
}
export function* getTranscriptSaga() {
  yield takeLatest(actions.GETDATA, getTranscript);
}
export default getTranscriptSaga;
