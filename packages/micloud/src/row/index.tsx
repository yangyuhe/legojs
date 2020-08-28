import React from "react";
import { LegoProps, register } from "@lego/core";
import { Merge } from "../util";
import "./index.less";
export interface RowOption {
  children: any;
  align: "left" | "right" | "center";
}
let defaultOption = {
  align: "left",
  children: null,
};
function Row(props: LegoProps<RowOption>) {
  const options = Merge(defaultOption, props.options);
  let align = "";
  if (options.align === "left") align = "flex-start";
  if (options.align == "right") align = "flex-end";
  if (options.align == "center") align = "center";
  return (
    <div
      className="micloud-row"
      style={{
        display: "flex",
        paddingBottom: "20px",
        justifyContent: align,
      }}
    >
      {options.children}
    </div>
  );
}
register({ type: "micloud-row", constructor: Row });
