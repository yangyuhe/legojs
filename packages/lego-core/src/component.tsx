import { GetBuiltIn } from "./builtin";
import { GetCustom } from "./custom";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";

export function GetComponent(
  config: ModuleConfig,
  scope: string,
  index: number
) {
  let res = getComponent(config.type);
  if (typeof res == "function") {
    return GetBuiltIn(config, scope);
  } else {
    return GetCustom(config, scope, index);
  }
}
