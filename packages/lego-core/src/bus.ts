import { ModuleConfig } from "./interface";
class Bus {
  private listeners: { [event: string]: any[][] } = {};
  emit(event: string, ...data: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((item) => {
        if (item[1] != null) {
          item[0](item[1](...data));
        } else item[0](...data);
      });
    }
  }
  listen(
    componentId: number,
    event: string,
    fn: Function,
    middleware?: Function
  ) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event] = this.listeners[event].filter(
      (item) => item[2] !== componentId
    );
    this.listeners[event].push([fn, middleware, componentId]);
  }
  unListen(event: string, fn: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (item) => item[0] !== fn
    );
  }
}
class EvtMgr {}
let bus = new Bus();
export default bus;
