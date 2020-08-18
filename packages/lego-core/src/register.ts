import { LegoComponent } from "./interface";
import { Lego } from "./lego";
let componentMap: { [key: string]: any } = {};
export function register(ComponentFactory: LegoComponent) {
  if (componentMap[ComponentFactory.type]) {
    throw new Error(`component ${ComponentFactory.type} already exist`);
  }
  componentMap[ComponentFactory.type] = ComponentFactory.constructor;
}
export function getComponent(name: string) {
  if (!componentMap[name]) {
    throw new Error(`component ${name} not exist`);
  }
  return componentMap[name];
}
