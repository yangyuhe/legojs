import { Action } from "./action";
const initialState = {
  showConfigPanel: false,
};

export default function (
  state = initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case Action.SHOW_CONFIG_PANEL:
      return { ...state, showConfigPanel: true };
    case Action.HIDE_CONFIG_PANEL:
      return { ...state, showConfigPanel: false };
    default:
      return state;
  }
}
