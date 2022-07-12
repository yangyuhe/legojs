import { createStore } from "redux";
const reducer = (state, action) => {
  if (!state) return {};
  let scope, variable, name, value;
  switch (action.type) {
    case "change":
      scope = action.payload.scope;
      variable = action.payload.variable;
      name = action.payload.name;
      value = action.payload.value;
      if (scope) {
        if (variable)
          return {
            ...state,
            [scope]: {
              ...state[scope],
              [variable]: {
                ...(state[scope] && state[scope][variable]),
                [name]: value,
              },
            },
          };
        else
          return {
            ...state,
            [scope]: {
              ...state[scope],
              [name]: value,
            },
          };
      } else {
        if (variable)
          return {
            ...state,
            [variable]: {
              ...state[variable],
              [name]: value,
            },
          };
        else
          return {
            ...state,
            [name]: value,
          };
      }
      break;
    case "initVariable":
      scope = action.payload.scope;
      variable = action.payload.variable;
      return {
        ...state,
        [scope]: {
          ...state[scope],
          [variable]: {},
        },
      };

    default:
      return state;
  }
};

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
(window as any).store = store;
export default store;
