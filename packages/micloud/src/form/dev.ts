import { describeModule } from "@lego/dev";
let config = `
    export interface MiFormItem {
        name: string;
        label: string;
        type: "input" | "textarea" | "select" | "radio" | "checkbox";
        options?: { label: string; value: any }[];
        rules?: any[];
        hidden?: boolean;
        value?: any;
      }
      const defaultOption: MiFormOption = {
        fields: [],
      };
`;
describeModule({ type: "micloud-form", des: config });
