import React from "react";
import { LegoProps, register } from "@lego/core";
import { Merge } from "../util";
import { Tabs } from "antd";

const { TabPane } = Tabs;
export interface TabOption {
  tabs: { title: string; key: string; content: any }[];
}
const defaultOption: TabOption = {
  tabs: [],
};
function Tab(props: LegoProps<TabOption>) {
  const options = Merge(defaultOption, props.options);
  if (options.tabs.length == 0) return null;
  return (
    <Tabs defaultActiveKey={options.tabs[0].key}>
      {options.tabs.map((tab) => (
        <TabPane tab={tab.title} key={tab.key}>
          {tab.content}
        </TabPane>
      ))}
    </Tabs>
  );
}
register({ type: "micloud-tab", constructor: Tab });
