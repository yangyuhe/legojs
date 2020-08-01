import React from "react";
import { LegoProps, register } from "@lego/core";
export interface ContainerOption {
  style: { [name: string]: any };
  children: any;
}
function Container(props: LegoProps<ContainerOption>) {
  return <div style={props.options.style}>{props.options.children()}</div>;
}
register({ type: "lego-container", constructor: Container });
