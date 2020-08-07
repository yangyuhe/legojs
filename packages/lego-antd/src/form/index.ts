import React from "react";
import { LegoProps, register } from "@lego/core";
export interface FormOption {
  field: FormItem[];
  name: string;
}
export interface FormItem {
  name: string;
  label: string;
  type: "input" | "textarea" | "select" | "radio" | "checkbox";
}
function Form(props: LegoProps<FormOption>) {
  return null;
}
register({ type: "lego-form", constructor: Form });
