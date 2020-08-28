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
    refs: {
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
                value: "hexiang",
                type: "input",
              },
              {
                label: "年龄",
                name: "age",
                value: 12,
                type: "input",
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
            content: "提交成功${JSON.stringify(form.result)}",
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
