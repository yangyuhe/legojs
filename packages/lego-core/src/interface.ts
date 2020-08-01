export interface ModuleConfig {
  type: string;
  name?: string;
  key?: string;
  emits: { [key: string]: string };
  triggers?: { [key: string]: string };
  states?: { [key: string]: string };
  options?: any;
  refs?: { [name: string]: ModuleConfig[] };
}
export interface LegoComponent {
  type: string;
  constructor: any;
}
export interface LegoProps<T> {
  emit: (event: string, ...data: any[]) => void;
  on: (event: string, fn: Function) => void;
  options: T;
  set: (name: string, value: any) => void;
  runArgs: any;
}
