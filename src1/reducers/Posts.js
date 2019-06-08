import * as actions from "../actions";

const initialStore = {
  Items: [],
  NewPost: null,
  errMsg: ""
};
export default function PostReducer(store = initialStore, action) {
  switch (action.type) {
    case actions._GETPOSTS_SUCCESS:
      return {
        ...store,
        errMsg: "",
        Items: action.payload
      };
    case actions._GETPOSTS_FAIL:
      return {
        ...store,
        errMsg: action.payload,
        Items: []
      };

    default:
      return store;
  }
}
