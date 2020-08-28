import { describeModule } from "@lego/dev";
let config = `
export interface ButtonOption {
  label: string;
  link?: string;
  type?: string;
}
const defaultOption: ButtonOption = {
  label: "",
};`;
describeModule({ type: "micloud-button", des: config });
