import { createStore } from "redux";
import { combineReducers } from "redux";
import app from "./app";
import config from "./config";

let reducers = combineReducers({ app, config });

export default createStore(reducers);
