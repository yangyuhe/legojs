import { Table, Button } from "antd";
import { LegoProps, ModuleConfig, register } from "@lego/core";
import React, { useState, useMemo, useEffect } from "react";
import { Merge } from "../util";
export interface TableOption {
  datas: any[];
  columns: {
    title: string;
    key: string;
    primary?: boolean;
    transform?: (data) => any;
  }[];
  operator?: { title: string; buttons: { label: string; event: string }[] };
}
const defaultOption: TableOption = {
  datas: [],
  columns: [],
};
export function LegoTable(props: LegoProps<TableOption>) {
  let option = Merge(defaultOption, props.options);
  let primaryRow = option.columns.find((item) => item.primary);
  const [data, setDate] = useState([]);
  let primaryKey = primaryRow ? primaryRow.key : "$index";
  let columns = useMemo(() => {
    let normals = option.columns.map((item) => {
      let column: any = {
        title: item.title,
        key: item.key,
        dataIndex: item.key,
      };
      if (item.transform) {
        column.render = (value) => {
          return item.transform(value);
        };
      }
      return column;
    });
    if (option.operator) {
      normals.push({
        title: option.operator.title,
        key: "$action",
        dataIndex: "$action",
        render(value, row) {
          return option.operator.buttons.map((btn) => {
            return (
              <Button
                key={btn.label}
                onClick={() => props.emit(btn.event, row[primaryKey])}
              >
                {btn.label}
              </Button>
            );
          });
        },
      });
    }
    return normals;
  }, [option.columns]);
  useEffect(() => {
    let data = option.datas;
    if (primaryKey === "$index") {
      data = option.datas.map((item, index) => ({ ...item, $index: index }));
    }
    setDate(data);
  }, [option.datas]);
  return (
    <Table
      className={props.id}
      rowKey={primaryKey}
      columns={columns}
      dataSource={data}
      style={{ paddingBottom: "20px" }}
    />
  );
}
register({
  type: "micloud-table",
  constructor: LegoTable,
});
