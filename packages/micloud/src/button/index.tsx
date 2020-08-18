import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { LegoProps, ModuleConfig, register } from "@lego/core";
import { Merge } from "../util";
export interface ButtonOption {
  text: string;
}
const defaultOption: ButtonOption = {
  text: "",
};
function LegoButton(props: LegoProps<ButtonOption>) {
  let options = Merge(defaultOption, props.options);
  const ref = useRef(0);
  useEffect(() => {
    props.set("times", ref.current);
  }, []);
  const OnClick = () => {
    ref.current = ref.current + 1;
    props.set("times", ref.current);
    props.emit("click");
  };
  return (
    <Button className={props.id} onClick={OnClick}>
      {options.text}
    </Button>
  );
}
register({ type: "antd-button", constructor: LegoButton });
