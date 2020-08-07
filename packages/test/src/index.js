import React from "react";
import ReactDom from "react-dom";
import { Lego, register } from "@lego/core";
import { LegoDev } from "@lego/dev";
import "@lego/components";
import "@lego/components/dist/dev";
import "@lego/dev/dist/main.css";
import ajax from "./mockAjax";
register([
  {
    type: "ajax",
    constructor: ajax,
  },
]);

let configs = [];
ReactDom.render(<LegoDev configs={configs} />, document.getElementById("app"));
