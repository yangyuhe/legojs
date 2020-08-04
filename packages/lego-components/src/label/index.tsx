import React from "react";
import { LegoProps, register } from "@lego/core";
export interface LabelOption {
  text: string;
}
function Label(props: LegoProps<LabelOption>) {
  return <span>{props.options.text}</span>;
}
register({ type: "lego-label", constructor: Label });
