import React, { useState } from "react";
import { register, LegoProps } from "@lego/core";
import { Merge } from "../util";
import axios, { Method } from "axios";

export interface AjaxOption {
  request:
    | { url: string; method: Method; params: any }
    | { url: string; method: Method; params }[];
  type: "parallel" | "serial";
  invoke: "immediate" | "trigger";
}
const defaultOption: AjaxOption = {
  request: [],
  type: "parallel",
  invoke: "immediate",
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
  const request = () => {
    if (Array.isArray(options.request)) {
      if (options.type == "parallel") {
        let promises = [];
        options.request.forEach((item) => {
          promises.push(
            axios.request({
              url: item.url,
              params: item.params,
              method: item.method,
            })
          );
        });
        Promise.resolve(promises)
          .then(
            (res) => {
              success(res);
            },
            (err) => {
              fail(err);
            }
          )
          .finally(() => {
            finish();
          });
      } else {
        let promise = null;
        let res = [];
        options.request.forEach((item) => {
          if (!promise) {
            promise = axios.request({
              url: item.url,
              params: item.params,
              method: item.method,
            });
          } else {
            promise = promise.then(
              (data) => {
                res.push(data);
                return axios.request({
                  url: item.url,
                  params: item.params,
                  method: item.method,
                });
              },
              (err) => {
                throw err;
              }
            );
          }
        });
        if (promise) {
          promise
            .then(
              (data) => {
                res.push(data);
                success(data);
              },
              (err) => {
                fail(err);
              }
            )
            .finally(() => {
              finish();
            });
        }
      }
    } else {
      axios
        .request({
          url: options.request.url,
          params: options.request.params,
          method: options.request.method,
        })
        .then(
          (res) => {
            success(res);
          },
          (err) => {
            fail(err);
          }
        )
        .finally(() => {
          finish();
        });
    }
  };

  if (options.invoke == "immediate") {
    request();
  }
  props.on("request", () => {
    request();
  });
  return <></>;
}

register({
  type: "antd-ajax",
  constructor: Ajax,
});
