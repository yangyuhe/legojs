import React from "react";
import { Button } from "antd";
import { LegoProps, ModuleConfig, register } from "@lego/core";
export interface ButtonOption {
  text: string;
  children: ModuleConfig | ModuleConfig[];
}
function LegoButton(props: LegoProps<ButtonOption>) {
  const OnClick = () => {
    props.emit("click");
  };
  return (
    <Button className={props.id} onClick={OnClick}>
      {props.options.text}
    </Button>
  );
}
register({ type: "lego-button", constructor: LegoButton });
