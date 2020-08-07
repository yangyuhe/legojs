import React from "react";
import ReactDom from "react-dom";
import { Lego, register } from "@lego/core";
import { LegoDev } from "@lego/dev";
import "@lego/antd";
import "@lego/antd/dist/dev";
import "@lego/dev/dist/main.css";

let configs = [
  {
    type: "lego-row",
  },
];
ReactDom.render(<LegoDev configs={configs} />, document.getElementById("app"));
