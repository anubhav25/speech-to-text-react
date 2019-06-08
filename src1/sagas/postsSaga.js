import { takeLatest, put } from "redux-saga/effects";
import * as actions from "../actions";

function* getposts(action) {
  try {
    let res = yield fetch(actions.baseUri + "/post/posts");
    res = yield res.json();
    if (res && res.response) {
      yield put({ type: actions._GETPOSTS_SUCCESS, payload: res.posts });
    } else {
      throw new Error();
    }
  } catch {
    yield put({
      type: actions._GETPOSTS_FAIL,
      payload: "SERVER ERROR"
    });
  }
}

export function* getpostsSaga() {
  yield takeLatest(actions.GETPOSTS, getposts);
}
