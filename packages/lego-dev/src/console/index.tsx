import { ModuleConfig } from "@lego/core";
import React, { useState } from "react";
import { getDescription } from "../register";
import { ConfigPanel } from "./configPanel";
import "./index.less";
import { ModuleTreePanel } from "./moduleTree";
import { useSelector, useDispatch } from "react-redux";
import { Action } from "../redux/action";
import { StringifyObject } from "../util";

export function Console() {
  let showConfigPanel = useSelector((store) => store.app.showConfigPanel);
  let [configDes, setConfigDes] = useState<string>("");
  let [configValue, setConfigValue] = useState<ModuleConfig | ModuleConfig[]>(
    null
  );
  let [curPath, setCurPath] = useState([]);
  const dispatch = useDispatch();
  let configs: ModuleConfig[] = useSelector((store) => store.config.configs);
  const getConfig = (
    paths: string[]
  ): { value: ModuleConfig | ModuleConfig[]; des: string } => {
    if (paths.length == 1 && paths[0] == "0") {
      return { des: "", value: configs };
    }
    paths.shift();
    let cur;
    for (let i = 0; i < paths.length; i++) {
      if (i == 0) {
        cur = configs[+paths[0]];
      } else {
        if (cur instanceof Array) cur = cur[paths[i]];
        else cur = cur.children[paths[i]];
      }
    }
    if (cur.type) {
      let des = getDescription(cur.type) || "";
      return { des, value: cur };
    } else {
      return { des: "", value: cur };
    }
  };
  let onConfigChange = (value: string) => {
    try {
      dispatch({
        type: Action.MODIFY_CONFIG,
        payload: { changes: new Function("return " + value)(), paths: curPath },
      });
      dispatch({ type: Action.HIDE_CONFIG_PANEL });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <ModuleTreePanel
        onModuleSelect={(paths) => {
          setCurPath(paths);
          let config = getConfig(paths.slice());
          setConfigDes(config.des);
          setConfigValue(config.value);
          dispatch({ type: Action.SHOW_CONFIG_PANEL });
        }}
      ></ModuleTreePanel>
      {showConfigPanel ? (
        <ConfigPanel
          onChange={onConfigChange}
          des={configDes}
          value={StringifyObject(configValue)}
        ></ConfigPanel>
      ) : null}
    </>
  );
}
