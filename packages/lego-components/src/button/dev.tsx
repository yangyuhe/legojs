import { describeModule } from "@lego/dev";
let config = `{
  //普通文字
  text: "string类型",
  children: "ModuleConfig配置",
}`;
describeModule({ type: "lego-button", des: config });
