import { ModuleConfig } from "./interface";
class Bus {
  private listeners: { [event: string]: Function[] } = {};
  emit(event: string, ...data: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((item) => item(...data));
    }
  }
  listen(event: string, fn: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  unListen(event: string, fn: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((item) => item !== fn);
  }
}
class EvtMgr {}
let bus = new Bus();
export default bus;
