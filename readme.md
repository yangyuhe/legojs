# lego 是乐高积木的意思，这个项目意在探索以配置的方式快速搭建前端页面，理想情况前端人员只需要编写通用的或者基础的组件，而真正的业务由业务人员去实现

### 什么是 lego 组件

lego 组件就是一个 React 组件，不管是使用 class 也好，function 也好。lego 组件的 props 有以下字段，这些字段是由框架在运行时传入的

```typescript
export interface LegoProps<T> {
  emit: (event: string, ...data: any[]) => void;
  on: (event: string, fn: Function) => void;
  options: T;
  set: (name: string, value: any) => void;
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
  triggers?: { [key: string]: string };
  options?: any;
  refs?: { [name: string]: ModuleConfig[] };
  id?: string;
}
```

### 基础组件示例，基础组件是使用 react 编写的组件

```typescript
import { Lego, register } from "@lego/core";
import React from "react";
import ReactDom from "react-dom";
//定义基础组件
function Hello(props) {
  let text = props.options.text;
  return `hello,${text}`;
}
//注册基础组件
register({ type: "Hello", constructor: Hello });
//使用基础组件
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

### 业务组件示例,业务组件是一堆基础组件的配置

```typescript
import { Lego, register } from "@lego/core";
import React from "react";
import ReactDom from "react-dom";
//定义基础组件
function Hello(props) {
  let text = props.options.text;
  return `hello,${text}`;
}
//注册基础组件
register({ type: "Hello", constructor: Hello });
//注册业务组件
register({
  type: "Foo",
  constructor: { type: "Hello", options: { text: "lego" } },
});
//使用业务组件
let configs = [
  {
    type: "Foo",
  },
];

ReactDom.render(<Lego configs={configs} />, document.getElementById("app"));
```
