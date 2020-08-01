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

let configs = [
  {
    type: "lego-container",
    refs: {
      children: {
        type: "lego-row",
        refs: {
          children: [
            {
              type: "lego-button",
              emits: {
                click: "showModal",
              },
              options: { text: "添加" },
            },
          ],
        },
        options: {
          children: "@children",
          align: "right",
        },
      },
    },
    options: {
      style: {
        marginBottom: "10px",
      },
      children: "@children",
    },
  },
  {
    type: "lego-modal",
    triggers: {
      show: "showModal",
      hide: "todoAddSuccess",
    },
    emits: {
      ok: "confirmModal",
    },
    options: {
      title: "新增todo",
      content: "@body",
    },
    refs: {
      body: [
        {
          type: "lego-input",
          options: {
            label: "主题",
          },
          states: {
            value: "theme",
          },
        },
        {
          type: "lego-input",
          options: {
            label: "内容",
          },
          states: {
            value: "jobcontent",
          },
        },
        {
          type: "ajax",
          options: {
            url: "/api/todo",
            method: "post",
          },
          triggers: {
            send: "confirmModal",
          },
          emits: {
            statusOk: "todoAddSuccess",
          },
        },
      ],
    },
  },
  {
    type: "lego-table",
    name: "todo列表",
    refs: {
      doneColumn: [
        {
          type: "lego-icon",
          options: { icon: "checked", color: "green" },
        },
        {
          type: "lego-icon",
          options: { icon: "close", color: "red" },
        },
      ],
    },
    options: {
      columns: [
        { title: "事务", key: "name" },
        { title: "时间", key: "time" },
        {
          title: "是否完成",
          key: "done",
          render: {
            type: "toggle",
            values: "@doneColumn",
          },
        },
      ],
    },
    triggers: {
      list: "myajax.ajax",
    },
  },
];
ReactDom.render(<LegoDev configs={configs} />, document.getElementById("app"));
