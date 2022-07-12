import { LegoProps, register } from "@lego/core";
import React, { useEffect, useState } from "react";
export interface ListOption {
  primaryKey: string;
}
const defaultOption: ListOption = {
  primaryKey: "",
};
export default function List(props: LegoProps<ListOption>) {
  const [list, setList] = useState([]);
  const option = props.options;
  if (!option.primaryKey) {
    throw new Error("micloud-list need a primary key");
  }
  useEffect(() => {
    props.set("data", list);
  }, []);
  props.on("add", function (data) {
    let newList = list.concat([data]);
    setList(newList);
    props.set("data", newList);
  });
  props.on("delete", function (id) {
    let newList = list.filter((item) => item[option.primaryKey] !== id);
    setList(newList);
    props.set("data", newList);
  });
  return <></>;
}
register({
  type: "micloud-list",
  constructor: List,
});
