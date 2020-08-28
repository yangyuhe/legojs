import { LegoComponent } from "./interface";
import { transformArray } from "./util";
let componentMap: { [key: string]: any } = {};
export function register(ComponentFactory: LegoComponent) {
  if (componentMap[ComponentFactory.type]) {
    throw new Error(`component ${ComponentFactory.type} already exist`);
  }
  let constr = ComponentFactory.constructor;
  if (typeof constr != "function") {
    constr = transformArray(constr as any);
  }
  componentMap[ComponentFactory.type] = constr;
}
export function getComponent(name: string) {
  if (!componentMap[name]) {
    throw new Error(`component ${name} not exist`);
  }
  return componentMap[name];
}
