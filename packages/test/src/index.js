import React from "react";
import ReactDom from "react-dom";
import { Lego, register } from "@lego/core";
import { LegoDev } from "@lego/dev";
import "micloud";
import "micloud/dist/index.css";
import "micloud/dist/dev";
import "@lego/dev/dist/main.css";

import home from "./home";
import login from "./login";

let clock = [
  {
    type: "lego-timmer",
    name: "timmer",
    options: {
      cancel: "${reset.times%2==0}",
      interval: 1000,
    },
  },
  {
    name: "reset",
    type: "antd-button",
    options: {
      text: "${$props.text}",
    },
  },
  {
    type: "lego-label",
    options: {
      text: "${timmer.tick.toLocaleString()}",
    },
  },
];
register({ type: "clock", constructor: clock });
let configs = [
  {
    type: "clock",
    options: {
      text: "${counter.times}",
    },
    name: "clock",
  },
  {
    type: "antd-button",
    name: "counter",
    options: {
      text: "${clock.reset.times}",
      options: "@extraBtn",
    },
    refs: {
      extraBtn: {
        type: "antd-button",
      },
    },
  },
];
ReactDom.render(<LegoDev configs={configs} />, document.getElementById("app"));
