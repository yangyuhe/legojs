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
let configs = [
  {
    type: "cloud-router",
    options: {
      content: "@content",
    },
    refs: {
      content: {
        type: "cloud-route",
        refs: {
          home: home,
          login: login,
        },
        options: {
          configs: [
            {
              path: "/login",
              component: "@login",
            },
            {
              path: "/home",
              component: "@home",
            },
            {
              redirect: "/login",
            },
          ],
        },
      },
    },
  },
];
ReactDom.render(<LegoDev configs={configs} />, document.getElementById("app"));
