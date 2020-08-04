import React, { useState, useMemo } from "react";
import { Modal } from "antd";
import { register, LegoProps } from "@lego/core";

export interface ModalOption {
  title: string;
  content: any;
}
export function LegoModal(props: LegoProps<ModalOption>) {
  let [visible, setVisible] = useState(false);
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
  let content = useMemo(() => {
    if (typeof props.options.content == "string") return props.options.content;
    return props.options.content();
  }, []);
  return (
    <Modal
      title={props.options.title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      className={props.id}
    >
      {content}
    </Modal>
  );
}
register({
  type: "lego-modal",
  constructor: LegoModal,
});
