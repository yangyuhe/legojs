import React from "react";
import ReactDom from "react-dom";
import { Lego, register } from "@lego/core";
import "micloud";
import "micloud/dist/index.css";
import "micloud/dist/dev";
import "./orderList";
import "./orderAdd";

let configs = [
  {
    type: "micloud-sidebar-layout",
    name: "root",
    refs: {
      orderList: {
        type: "orderList",
        options: {
          username: "${root.userinfo.name}",
        },
      },
      orderAdd: {
        type: "orderAdd",
        options: {
          username: "${root.userinfo.name}",
        },
      },
    },
    options: {
      title: "ACL",
      menus: [
        {
          title: "工单管理",
          key: "order-mgr",
          children: [
            {
              title: "工单列表",
              key: "list",
              url: "/list",
            },
            {
              title: "新增工单",
              key: "order-add",
              url: "/add",
            },
          ],
        },
      ],
      routers: [
        {
          path: "/list",
          component: "@orderList",
        },
        {
          path: "/add",
          component: "@orderAdd",
        },
      ],
      redirect: "/list",
    },
  },
];
ReactDom.render(<Lego configs={configs} />, document.getElementById("app"));
