import { createStore } from "redux";
const reducer = (state, action) => {
  if (!state) return {};
  switch (action.type) {
    case "change":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const store = createStore(reducer);
export default store;
