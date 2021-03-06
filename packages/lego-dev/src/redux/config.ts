import { Action } from "./action";
import { ModuleConfig } from "@lego/core/dist/interface";
const initialState = {
  configs: null,
};
export default function (
  state = initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case Action.INIT_CONFIG:
      let initConfig = transferConfig(action.payload);
      addId(initConfig, "0");
      return { ...state, configs: action.payload };
    case Action.MODIFY_CONFIG:
      let { changes, paths } = action.payload;
      if (paths.length == 1 && paths[0] == "0") {
        addId(changes, "0");
        return { ...state, configs: changes };
      }
      paths.shift();
      let newConfigs = modifyConfig(state.configs, changes, paths);
      addId(newConfigs, "0");
      return { ...state, configs: newConfigs };
    default:
      return state;
  }
}
function modifyConfig(
  oldConfigs: ModuleConfig[],
  changes: ModuleConfig | ModuleConfig[],
  paths: string[]
) {
  let top = paths.shift();
  let newConfigs: ModuleConfig[] = [];
  for (let i = 0; i < oldConfigs.length; i++) {
    if (+top != i) {
      newConfigs.push(oldConfigs[i]);
    } else {
      if (paths.length == 0) {
        if (!Array.isArray(changes)) {
          newConfigs.push(changes);
        }
      } else {
        let newItems = modifychildrenOfConfig(
          oldConfigs[+top].children,
          changes,
          paths
        );
        oldConfigs[+top].children = newItems;
        newConfigs.push(oldConfigs[+top]);
      }
    }
  }
  return newConfigs;
}
function modifychildrenOfConfig(
  oldConfigs: { [name: string]: ModuleConfig[] },
  changes: ModuleConfig | ModuleConfig[],
  paths: string[]
) {
  let top = paths.shift();
  if (paths.length == 0) {
    let newConfigs = { ...oldConfigs, [top]: changes as ModuleConfig[] };
    return newConfigs;
  } else {
    let newItems = modifyConfig(oldConfigs[top], changes, paths);
    let newConfigs = { ...oldConfigs, [top]: newItems };
    return newConfigs;
  }
}

function transferConfig(configs: ModuleConfig[]) {
  if (!Array.isArray(configs)) configs = [configs];
  configs.forEach((config) => {
    if (config.children) {
      Object.keys(config.children).forEach((key) => {
        if (!Array.isArray(config.children[key])) {
          config.children[key] = [config.children[key] as any];
        }
        config.children[key] = transferConfig(config.children[key]);
      });
    }
  });
  return configs;
}
function addId(configs: ModuleConfig[], parentIndex) {
  configs.map((item, index) => {
    item.id = parentIndex + "-" + index;
    if (item.children) {
      for (let key in item.children) {
        let config = item.children[key];
        addId(config, parentIndex + "-" + index + "-" + key);
      }
    }
  });
}
