import React from "react";
import { LegoProps, register } from "@lego/core";
import { Form, Input, Select, DatePicker } from "antd";
import { Merge } from "../util";
export interface MiFormOption {
  fields: MiFormItem[];
}
export interface MiFormItem {
  name: string;
  label: string;
  type: "input" | "textarea" | "select" | "radio" | "checkbox" | "ajax-select";
  options?: { label: string; value: any }[];
  rules?: any[];
  hidden?: boolean;
  value?: any;
  url: "";
}
const defaultOption: MiFormOption = {
  fields: [],
};
function MiForm(props: LegoProps<MiFormOption>) {
  let option = Merge(defaultOption, props.options);
  const [form] = Form.useForm();
  props.on("submit", () => {
    form.validateFields().then((values) => {
      props.emit("submit", values);
      props.set("result", values);
      form.resetFields();
    });
  });
  let initialValues = {};
  option.fields.forEach((field) => {
    if (field.value !== undefined) initialValues[field.name] = field.value;
  });
  return (
    <Form className={props.id} form={form} initialValues={initialValues}>
      {option.fields.map((item) => {
        let control = null;
        if (item.type == "input") {
          control = <Input></Input>;
        }
        if (item.type == "select") {
          control = (
            <Select>
              {item.options &&
                item.options.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
            </Select>
          );
        }
        return (
          <Form.Item
            key={item.name}
            label={item.label}
            name={item.name}
            rules={item.rules}
            style={{ display: item.hidden ? "none" : "" }}
          >
            {control}
          </Form.Item>
        );
      })}
    </Form>
  );
}
register({ type: "micloud-form", constructor: MiForm });
