import { GetBuiltIn } from "./builtin";
import { GetCustom } from "./custom";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";

const scopeMap = {};
let id = 0;
export function GetComponent(config: ModuleConfig, scope: string) {
  if (config.scope) {
    if (scopeMap[config.scope]) {
      throw new Error(`scope [${config.scope}] duplicate, ${config.type}`);
    } else {
      scopeMap[config.scope] = scope;
    }
  }
  if (config.name && scopeMap[config.name]) {
    throw new Error(
      `component name [${config.name}] cannot be same as scope [${config.name}],${config.type}`
    );
  }
  let res = getComponent(config.type);
  if (typeof res == "function") {
    return GetBuiltIn(config, scope);
  } else {
    return GetCustom(config, scope);
  }
}
export function AttachScope(context, state) {
  Object.keys(scopeMap).forEach((alias) => {
    Object.defineProperty(context, alias, {
      get: function () {
        return state[scopeMap[alias]];
      },
    });
  });
  return context;
}
export function GetScopeName() {
  return "$scope" + id++;
}
