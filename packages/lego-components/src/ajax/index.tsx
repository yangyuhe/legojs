import React, { useState } from "react";
import { register, LegoProps } from "@lego/core";

export interface AjaxOption {
  url: string;
  method: string;
}
function LegoAjax(props: LegoProps<AjaxOption>) {
  let [list, setList] = useState([]);
  props.on("send", () => {
    console.log("发送请求," + props.options.method + "," + props.options.url);
    setTimeout(() => {
      props.emit("statusOK");
      if (props.options.url == "/api/")
        props.set("response", { code: 200, data: {} });
    }, 1000);
  });
  return <></>;
}
register({
  type: "lego-ajax",
  constructor: LegoAjax,
});
