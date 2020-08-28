import React, { useState } from "react";
import { LegoProps, register } from "@lego/core";
import { Merge } from "../util";
export interface IfOption {
  children: any;
  initialShow: boolean;
}
const defaultOption: IfOption = {
  children: null,
  initialShow: true,
};
function If(props: LegoProps<IfOption>) {
  let options = Merge(defaultOption, props.options);
  const [show, setShow] = useState(options.initialShow);
  props.on("show", () => {
    setShow(true);
  });
  props.on("hide", () => {
    setShow(false);
  });
  if (show) {
    return options.children;
  } else return null;
}
register({ type: "micloud-if", constructor: If });
