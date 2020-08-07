import { Table } from "antd";
import { LegoProps, ModuleConfig, register } from "@lego/core";
import React, { useState, useMemo } from "react";
export interface TableProps {
  operators: ModuleConfig[];
  columns: {
    title: string;
    key: string;
    render?: { type: "toggle" | "lego"; values: any };
  }[];
}
export function LegoTable(props: LegoProps<TableProps>) {
  let [data, setData] = useState([]);
  let columns = useMemo(() => {
    return props.options.columns.map((item) => {
      let column: any = {
        title: item.title,
        key: item.key,
        dataIndex: item.key,
      };
      if (item.render) {
        if (item.render.type == "toggle") {
          column.render = (text) => {
            if (text) {
              return item.render?.values[0];
            }
            return item.render?.values[1];
          };
        }
      }
      return column;
    });
  }, [props.options.columns]);
  props.on("list", (data) => {
    setData(data);
  });
  return <Table className={props.id} columns={columns} dataSource={data} />;
}
register({
  type: "lego-table",
  constructor: LegoTable,
});
