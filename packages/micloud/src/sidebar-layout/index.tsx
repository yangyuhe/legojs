import React, { useState } from "react";
import { register, LegoProps } from "@lego/core";
import { Layout, Menu, Dropdown } from "antd";
import "./index.less";
import { icons } from "../icon/index";
import { Link } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Merge } from "../util";
const { Header, Sider, Content } = Layout;

export interface LayoutOption {
  menus: {
    name: string;
    url: string;
    icon?: string;
    key?: string;
  }[];
  defaultSelectedMenu: string;
  defaultOpenMenu: string;
  logo: string;
  logoBgColor: string;
  content: any;
}
const defaultOption: LayoutOption = {
  menus: [],
  defaultSelectedMenu: "",
  defaultOpenMenu: "",
  logo: "",
  content: null,
  logoBgColor: "",
};
function AntdLayout(props: LegoProps<LayoutOption>) {
  let [collapsed, setCollapsed] = useState(false);
  let options = Merge(defaultOption, props.options);
  let authMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/logout">退出登录</Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout className="antd-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ backgroundColor: options.logoBgColor }}>
          {options.logo ? <img src={options.logo} /> : null}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          {options.menus.map((item, index) => {
            return (
              <Menu.Item key={item.key || index} icon={icons[item.icon]}>
                <Link to={item.url}>{item.name}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => {
                setCollapsed(!collapsed);
              },
            }
          )}
          <Dropdown className="auth" overlay={authMenu}>
            <span className="ant-dropdown-link">
              <UserOutlined /> <DownOutlined />
            </span>
          </Dropdown>
          ,
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {typeof options.content == "function"
            ? options.content()
            : options.content}
        </Content>
      </Layout>
    </Layout>
  );
}
register({ type: "sidebar-layout", constructor: AntdLayout });
