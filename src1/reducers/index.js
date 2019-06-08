import * as actions from "../actions";

const initialStore = {
  transcript: "",
  loading: false,
  error: ""
};
export default function reducer(store = initialStore, action) {
  switch (action.type) {
    case actions._GETDATA_SUCCESS:
      return {
        ...store,
        transcript: action.payload,
        loading: false
      };
    case actions._GETDATA_FAIL:
      return {
        ...store,
        error: action.payload,
        loading: false
      };
    case actions.GETDATA:
      return {
        ...store,
        loading: true
      };
    default:
      return store;
  }
}
