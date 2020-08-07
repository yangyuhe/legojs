import React from "react";
import { LegoProps, register } from "@lego/core";
export interface RowOption {
  children: any;
  align: "left" | "right";
}
let defaultOption = {
  align: "left",
  children: () => null,
};
function Row(props: LegoProps<RowOption>) {
  let options = Object.assign(defaultOption, props.options);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: options.align == "left" ? "flex-start" : "flex-end",
      }}
    >
      {options.children()}
    </div>
  );
}
register({ type: "lego-row", constructor: Row });
