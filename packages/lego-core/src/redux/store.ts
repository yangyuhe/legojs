import { createStore } from "redux";
const reducer = (state, action) => {
  if (!state) return {};
  switch (action.type) {
    case "change":
      let { scope, name, value } = action.payload;
      let paths = scope.split(".");
      paths.push(name);
      let newState = getNew(state, paths, value);
      console.log(newState);
      return newState;
    default:
      return state;
  }
};
function getNew(state, paths: string[], value) {
  if (paths.length == 1) {
    return { ...state, [paths[0]]: value };
  }
  let copy = { ...state };
  let top = paths.shift();
  copy[top] = getNew(copy[top], paths, value);
  return copy;
}

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
(window as any).store = store;
export default store;
