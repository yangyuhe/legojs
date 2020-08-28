import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { LegoProps, ModuleConfig, register } from "@lego/core";
import { Merge } from "../util";
import { Link } from "react-router-dom";
export interface ButtonOption {
  label: string;
  link?: string;
  type?: string;
}
const defaultOption: ButtonOption = {
  label: "",
};

function LegoButton(props: LegoProps<ButtonOption>) {
  let options = Merge(defaultOption, props.options);
  const OnClick = () => {
    props.emit("click");
  };
  if (!options.link)
    return (
      <Button className={props.id} onClick={OnClick} type={options.type as any}>
        {options.label}
      </Button>
    );
  else
    return (
      <Button className={props.id} onClick={OnClick} type={options.type as any}>
        <Link to={options.link}>{options.label}</Link>
      </Button>
    );
}
register({ type: "micloud-button", constructor: LegoButton });
