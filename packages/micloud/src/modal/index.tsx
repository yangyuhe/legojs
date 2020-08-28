import React, { useState, useMemo } from "react";
import { Modal } from "antd";
import { register, LegoProps } from "@lego/core";
import { Merge } from "../util";

export interface ModalOption {
  title: string;
  content: any;
  initialShow: boolean;
}
const defaultOption: ModalOption = {
  title: "",
  content: "",
  initialShow: false,
};
export function MiModal(props: LegoProps<ModalOption>) {
  let options = Merge(defaultOption, props.options);
  let [visible, setVisible] = useState(options.initialShow);
  props.on("show", () => {
    setVisible(true);
  });
  props.on("hide", () => {
    setVisible(false);
  });
  const onOk = () => {
    props.emit("ok");
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };
  return (
    <Modal
      title={options.title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      className={props.id}
    >
      {options.content}
    </Modal>
  );
}
register({
  type: "micloud-modal",
  constructor: MiModal,
});
