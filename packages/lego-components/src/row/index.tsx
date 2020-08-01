import React from "react";
import { LegoProps, register } from "@lego/core";
export interface RowOption {
  children: any;
  align: "left" | "right";
}
function Row(props: LegoProps<RowOption>) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          props.options.align == "left" ? "flex-start" : "flex-end",
      }}
    >
      {props.options.children()}
    </div>
  );
}
register({ type: "lego-row", constructor: Row });
