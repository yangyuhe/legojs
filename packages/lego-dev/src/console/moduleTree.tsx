import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Tree } from "antd";
import "./index.less";
import { ModuleConfig } from "@lego/core";
import { useSelector } from "react-redux";
interface Props {
  onModuleSelect: (paths: string[]) => void;
}
export function ModuleTreePanel(props: Props) {
  const configs: ModuleConfig[] = useSelector((store) => store.config.configs);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const configPanelShow = useSelector((store) => store.app.showConfigPanel);
  useEffect(() => {
    if (!configPanelShow) {
      setSelectedKeys([]);
    }
  }, [configPanelShow]);
  const transfer = (configs: ModuleConfig[], parentIndex) => {
    return configs.map((item, index) => {
      let data = {
        title: item.name || item.type,
        key: parentIndex + "-" + index,
        children: [],
      };
      if (item.refs) {
        for (let key in item.refs) {
          let config = item.refs[key];
          config = Array.isArray(config) ? config : [config];
          let child = {
            title: key,
            key: parentIndex + "-" + index + "-" + key,
            children: transfer(config, parentIndex + "-" + index + "-" + key),
          };
          data.children.push(child);
        }
      }
      return data;
    });
  };
  const treeData = useMemo(() => {
    let rootChildren = [];
    if (configs) {
      rootChildren = transfer(configs, "0");
    }
    return [
      {
        title: "root",
        key: "0",
        children: rootChildren,
      },
    ];
  }, [configs]);
  const onSelect = (selectedKeys, e) => {
    if (e.selected) {
      setSelectedKeys(selectedKeys);
      let path = selectedKeys[0];
      let paths = path.split("-");
      props.onModuleSelect(paths);
    } else {
      setSelectedKeys([]);
    }
  };
  return (
    <div className="module-tree">
      <Tree
        onSelect={onSelect}
        showLine={false}
        showIcon={false}
        treeData={treeData}
        selectedKeys={selectedKeys}
      />
    </div>
  );
}
