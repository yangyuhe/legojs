import React from "react";
import ReactDom from "react-dom";
import { Lego, register } from "@lego/core";
import { LegoDev } from "@lego/dev";
import "micloud";
import "micloud/dist/index.css";
import "micloud/dist/dev";
import "@lego/dev/dist/main.css";

let configs = [
  {
    type: "micloud-container",
    scope: "$root",
    children: {
      children: [
        {
          type: "micloud-form",
          name: "form",
          triggers: {
            submit: "save.click",
          },
          options: {
            fields: [
              {
                label: "姓名",
                name: "username",
                type: "input",
                rules: [{ required: true }],
              },
              {
                label: "年龄",
                name: "age",
                type: "input",
                rules: [{ required: true }],
              },
            ],
          },
        },
        {
          type: "micloud-button",
          name: "save",
          options: {
            label: "保存",
          },
        },
        {
          type: "micloud-modal",
          triggers: {
            show: "form.submit",
          },
          options: {
            title: "提示",
            content: "提交成功",
            type: "success",
          },
        },
        {
          type: "micloud-table",
          name: "table",
          options: {
            datas: "${list.data||[]}",
            columns: [
              {
                title: "年龄",
                key: "age",
              },
              {
                title: "姓名",
                key: "username",
                primary: true,
              },
            ],
            operator: {
              title: "操作",
              buttons: [
                {
                  event: "delete",
                  label: "删除",
                },
              ],
            },
          },
        },
        {
          type: "micloud-list",
          name: "list",
          options: {
            primaryKey: "username",
          },
          triggers: {
            add: "form.submit",
            delete: "table.delete",
          },
        },
      ],
    },
    options: {
      style: {
        padding: "20px",
      },
      children: "@children",
    },
  },
];
ReactDom.render(<LegoDev configs={configs} />, document.getElementById("app"));
