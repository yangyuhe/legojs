import React from "react";
import { LegoProps, register } from "@lego/core";
import { Merge } from "../util";
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
export interface IconOption {
  name: string;
}
const defaultOption = {
  name: "",
};
export const icons = {
  StepBackwardOutlined: <StepBackwardOutlined />,
  StepForwardOutlined: <StepForwardOutlined />,
  AreaChartOutlined: <AreaChartOutlined />,
  PieChartOutlined: <PieChartOutlined />,
  BarChartOutlined: <BarChartOutlined />,
};
function Icon(props: LegoProps<IconOption>) {
  let options: IconOption = Merge(defaultOption, props.options);
  if (options.name) {
    return icons[options.name];
  }
  return null;
}
register({ type: "antd-icon", constructor: Icon });
