import React from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { LegoProps, register } from "@lego/core";
const icons = {
  checked: CheckOutlined,
  close: CloseOutlined,
};
export interface IconOption {
  icon: string;
  color?: string;
  fontsize?: number;
}
export function Icon(props: LegoProps<IconOption>) {
  let I = icons[props.options.icon];
  if (!I) {
    throw new Error(`no ${props.options.icon} icon`);
  }
  return (
    <I
      style={{ color: props.options.color, fontSize: props.options.fontsize }}
    ></I>
  );
}
register({
  type: "lego-icon",
  constructor: Icon,
});
