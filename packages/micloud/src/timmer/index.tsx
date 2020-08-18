import React, { useEffect, useState } from "react";
import { LegoProps, register } from "@lego/core";
export interface TimmerOption {
  interval?: number;
  timeout?: number;
  cancel: boolean;
}
let defaultOption: TimmerOption = {
  cancel: false,
};
function Timmer(props: LegoProps<TimmerOption>) {
  let options = Object.assign(defaultOption, props.options);
  let [identifier, setIdentifier] = useState<any>(0);

  useEffect(() => {
    if (!options.cancel) {
      if (options.timeout) {
        props.set("done", false);
        let id = setTimeout(() => {
          props.emit("done");
          props.set("done", true);
        }, options.timeout);
        setIdentifier(id);
        return () => {
          clearTimeout(id);
        };
      }
      if (options.interval) {
        let id = setInterval(() => {
          let now = new Date();
          props.emit("tick", now);
          props.set("tick", now);
        }, options.interval);
        setIdentifier(id);
        return () => {
          clearInterval(id);
        };
      }
    }
  }, [options.cancel]);
  props.on("cancel", () => {
    if (options.interval) {
      clearInterval(identifier);
    }
    if (options.timeout) {
      clearInterval(identifier);
    }
  });
  return <></>;
}
register({ type: "lego-timmer", constructor: Timmer });
