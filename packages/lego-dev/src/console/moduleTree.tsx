import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { Tree } from "antd";
import "./index.less";
import { ModuleConfig } from "@lego/core";
import { useSelector } from "react-redux";
import { DevContext } from "../main";
interface Props {
  onModuleSelect: (paths: string[]) => void;
}
export function ModuleTreePanel(props: Props) {
  const configs: ModuleConfig[] = useSelector((store) => store.config.configs);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const configPanelShow = useSelector((store) => store.app.showConfigPanel);
  const devContext = useContext(DevContext);
  useEffect(() => {
    if (!configPanelShow) {
      setSelectedKeys([]);
    }
  }, [configPanelShow]);
  const getTree = (configs: ModuleConfig[]) => {
    return configs.map((item, index) => {
      let data = {
        title: item.name || item.type,
        key: item.id,
        children: [],
      };
      if (item.refs) {
        for (let key in item.refs) {
          let config = item.refs[key];
          let child = {
            title: key,
            key: item.id + "-" + key,
            children: getTree(config),
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
      rootChildren = getTree(configs);
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
      devContext.postMessage({
        type: "lego_tree_focus",
        value: path,
      });
    } else {
      setSelectedKeys([]);
    }
  };
  const mouseEnter = (evt) => {
    debugger;
    devContext.postMessage({
      type: "lego_tree_focus",
      value: evt.node.key,
    });
  };
  const mouseLeave = (evt) => {
    devContext.postMessage({
      type: "lego_tree_blur",
    });
  };
  return (
    <div className="module-tree">
      <Tree
        onSelect={onSelect}
        showLine={false}
        showIcon={false}
        treeData={treeData}
        selectedKeys={selectedKeys}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      />
    </div>
  );
}
