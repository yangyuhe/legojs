import { LegoComponent } from "./interface";
let componentMap: { [key: string]: any } = {};
export function register(ComponentFactory: LegoComponent | LegoComponent[]) {
  if (!Array.isArray(ComponentFactory)) ComponentFactory = [ComponentFactory];
  ComponentFactory.forEach((item) => {
    if (componentMap[item.type]) {
      throw new Error(`component ${item.type} already exist`);
    }
    componentMap[item.type] = item.constructor;
  });
}
export function getComponent(name: string) {
  if (!componentMap[name]) {
    throw new Error(`component ${name} not exist`);
  }
  return componentMap[name];
}
