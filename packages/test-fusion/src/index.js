import React from "react";
import ReactDom from "react-dom";
import { Lego, register } from "@lego/core";
import "micloud";
import "micloud/dist/index.css";
import "micloud/dist/dev";
import "./orderTab";
import "./orderAdd";

let configs = [
  {
    type: "micloud-sidebar-layout",
    name: "root",
    scope: "$global",
    children: {
      orderTab: {
        type: "orderTab",
        options: {
          username: "${root.userinfo.name}",
        },
      },
      orderAdd: {
        type: "orderAdd",
        scope: "$orderAdd",
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
              url: "/product/acl/list",
            },
            {
              title: "新增工单",
              key: "order-add",
              url: "/product/acl/add",
            },
          ],
        },
      ],
      routers: [
        {
          path: "/product/acl/list",
          component: "@orderTab",
        },
        {
          path: "/product/acl/add",
          component: "@orderAdd",
        },
      ],
      redirect: "/product/acl/list",
    },
  },
  {
    type: "micloud-ajax",
    scope: "$data",
    name: "getgroup",
    options: {
      url: "/api/service/v1/netacl/staging/api/v1/user/groupname",
      params: {
        username: "${$global.root.userinfo.name}",
      },
      immediate: "${$global.root.userinfo && $global.root.userinfo.name}",
    },
  },
];
ReactDom.render(<Lego configs={configs} />, document.getElementById("app"));
