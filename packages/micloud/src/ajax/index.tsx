import React, { useState, useEffect } from "react";
import { register, LegoProps } from "@lego/core";
import { Merge } from "../util";
import axios, { Method } from "axios";

export interface AjaxOption {
  url: string;
  method: "get" | "post" | "delete" | "put";
  params: any;
  immediate: boolean;
}
const defaultOption: AjaxOption = {
  url: "",
  method: "get",
  params: {},
  immediate: true,
};
function Ajax(props: LegoProps<AjaxOption>) {
  let options = Merge(defaultOption, props.options);

  const success = (data) => {
    props.emit("success", data);
    props.set("state", "success");
    props.set("data", data);
  };
  const fail = (err) => {
    props.emit("fail", err);
    props.set("state", "fail");
    props.set("err", err);
  };
  const finish = () => {
    props.emit("finish");
    props.set("isFinish", true);
  };
  const request = (data?) => {
    axios
      .request({
        url: options.url,
        params: data || options.params,
        method: options.method,
      })
      .then(
        (res) => {
          let data = res.data;
          success(data);
        },
        (err) => {
          fail(err);
        }
      )
      .finally(() => {
        finish();
      });
  };
  useEffect(() => {
    if (options.immediate && options.url) {
      request();
    }
  }, [options.immediate]);

  props.on("request", (data) => {
    // request(data);
    debugger;
  });
  return <></>;
}

register({
  type: "micloud-ajax",
  constructor: Ajax,
});
