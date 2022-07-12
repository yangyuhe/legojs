export interface ModuleConfig {
  type: string;
  name?: string;
  triggers?: { [key: string]: string | [string, Function] };
  options?: any;
  children?: { [name: string]: ModuleConfig[] };
  id?: string;
  scope?: string;
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
  id: string;
}
