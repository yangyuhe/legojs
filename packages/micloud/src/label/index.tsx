import React from "react";
import { LegoProps, register } from "@lego/core";
export interface LabelOption {
  text: string | (() => string);
}
function Label(props: LegoProps<LabelOption>) {
  let text = "";
  if (typeof props.options.text == "function") text = props.options.text();
  else text = props.options.text;
  return <span>{text}</span>;
}
register({ type: "micloud-label", constructor: Label });
