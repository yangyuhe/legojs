import React from "react";
import { LegoProps, register } from "@lego/core";
import { Merge } from "../util";
import "./index.less";
export interface TitleOption {
  label: string;
}
const defaultOption: TitleOption = {
  label: "",
};
function Title(props: LegoProps<TitleOption>) {
  let option = Merge(defaultOption, props.options);
  return <div className="micloud-page-title">{option.label}</div>;
}
register({ type: "micloud-page-title", constructor: Title });
