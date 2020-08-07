# lego 是乐高积木的意思，这个项目意在探索以配置的方式快速搭建前端页面，理想情况前端人员只需要编写通用的或者基础的组件，而真正的业务由业务人员去实现

### 什么是 lego 组件

lego 组件就是一个 React 组件，不管是使用 class 也好，function 也好。lego 组件的 props 有以下字段，这些字段是由框架在运行时传入的

```typescript
export interface LegoProps<T> {
  emit: (event: string, ...data: any[]) => void;
  on: (event: string, fn: Function) => void;
  options: T;
  set: (name: string, value: any) => void;
  runArgs: any;
  id: string;
}
```

emit 可以让组件发出一个事件，on 可以让组件监听一个事件，options 是组件配置项，set 可以让组件设置一个其他组件可以访问的 redux 值，runArgs 是组件运行时参数（用于复杂场景）

### 如何书写 lego 配置文件

配置文件是一个 ModuleConfig 数组,ModuleConfig 结构如下

```typescript
export interface ModuleConfig {
  type: string;
  name?: string;
  key?: string;
  emits: { [key: string]: string };
  triggers?: { [key: string]: string };
  states?: { [key: string]: string };
  options?: any;
  refs?: { [name: string]: ModuleConfig[] };
  id?: string;
}
```

### 最简单的事例

```typescript
import { Lego, register } from "@lego/core";
import React from "react";
import ReactDom from "react-dom";
//定义组件
function Hello(props) {
  let text = props.options.text;
  return `hello,${text}`;
}
//注册组件
register({ type: "Hello", constructor: Hello });
//配置文件
let configs = [
  {
    type: "Hello",
    options: {
      text: "lego",
    },
  },
];

ReactDom.render(<Lego configs={configs} />, document.getElementById("app"));
```
