import React from "react";
import { LegoProps, register } from "@lego/core";
import { Layout } from "antd";
import { Merge } from "../util";

const { Header, Footer, Content } = Layout;
export interface SimpleLayoutOption {
  header: any;
  content: any;
  footer: any;
}
const defaultOption = {
  header: null,
  content: null,
  footer: null,
};
function SimpleLayout(props: LegoProps<SimpleLayoutOption>) {
  let options = Merge(defaultOption, props.options);
  return (
    <Layout>
      <Header>
        {typeof options.header == "function"
          ? options.header()
          : options.header}
      </Header>
      <Content>
        {typeof options.content == "function"
          ? options.content()
          : options.content}
      </Content>
      <Footer>
        {typeof options.footer == "function"
          ? options.footer()
          : options.footer}
      </Footer>
    </Layout>
  );
}
register({ type: "simple-layout", constructor: SimpleLayout });
