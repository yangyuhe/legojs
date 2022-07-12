import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "antd";
import { register, LegoProps } from "@lego/core";
import { Merge } from "../util";

export interface ModalOption {
  title: string;
  content: any;
  initialShow: boolean;
  type?: "success" | "normal";
}
const defaultOption: ModalOption = {
  title: "",
  content: "",
  initialShow: false,
  type: "normal",
};
var modal;
export function MiModal(props: LegoProps<ModalOption>) {
  let options = Merge(defaultOption, props.options);
  let [visible, setVisible] = useState(options.initialShow);
  useEffect(() => {
    props.on("show", () => {
      setVisible(true);
      showModalSuccess();
    });
  }, []);

  props.on("hide", () => {
    setVisible(false);
    if (modal) modal.destroy();
  });
  const onOk = () => {
    props.emit("ok");
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };
  const showModalSuccess = () => {
    modal = Modal.success({
      title: options.title,
      content: options.content,
      onOk: onOk,
    });
  };
  useEffect(() => {
    if (visible) {
      showModalSuccess();
    }
  }, []);
  if (options.type === "success") {
    return null;
  }
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
