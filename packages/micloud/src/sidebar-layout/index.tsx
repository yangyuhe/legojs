import { LegoProps, register } from "@lego/core";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import "./index.less";
import {
  BrowserRouter,
  HashRouter,
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  matchPath,
} from "react-router-dom";
import { icons } from "../icon/index";
import { Merge } from "../util";
import axios from "axios";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
export interface SidebarLayoutOption {
  menus?: MenuOption[];
  historyApi: boolean;
  redirect?: string;
  notFound?: any;
  routers: { path: string; component: any }[];
  title: string;
}
export interface MenuOption {
  title: string;
  url?: string;
  icon?: string;
  children?: MenuOption[];
  key: string;
}
const defaultOption: SidebarLayoutOption = {
  menus: [],
  historyApi: false,
  routers: [],
  title: "",
};
function SidebarLayoutContainer(props: LegoProps<SidebarLayoutOption>) {
  let options = Merge(defaultOption, props.options);
  if (!options.historyApi)
    return (
      <HashRouter>
        <SidebarLayout {...props}></SidebarLayout>
      </HashRouter>
    );
  else
    return (
      <BrowserRouter>
        <SidebarLayout {...props}></SidebarLayout>
      </BrowserRouter>
    );
}
function SidebarLayout(props: LegoProps<SidebarLayoutOption>) {
  let options = Merge(defaultOption, props.options);
  const [logined, setLogined] = useState(false);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);

  useEffect(() => {
    let selected = [];
    let opened = [];
    const isMatch = (menus: MenuOption[]): boolean => {
      let matched = false;
      menus.forEach((menu) => {
        if (!menu.url) {
          if (menu.children) {
            let match = isMatch(menu.children);
            if (match) {
              opened.push(menu.key);
              matched = true;
            }
          }
        } else {
          let match = matchPath(location.pathname, menu.url);
          if (match) {
            selected.push(menu.key);
            matched = true;
          }
        }
      });
      return matched;
    };
    isMatch(options.menus);
    setOpenMenu(opened);
    setSelectedMenu(selected);
  }, [location.pathname]);
  useEffect(() => {
    login().then((data) => {
      props.set("userinfo", data);
      (window as any).createFusionCloudHeader({
        username: data.name,
        userGlobalId: data.global_id,
      });
      setLogined(true);
    });
  }, []);
  if (!logined) return null;
  return (
    <Layout className="micloud-sidebarlayout" style={{ height: "100%" }}>
      <Sider theme="light" className="micloud-sidebar">
        <div className="title">{options.title}</div>
        <Menu mode="inline" openKeys={openMenu} selectedKeys={selectedMenu}>
          {getMenu(options.menus)}
        </Menu>
      </Sider>
      <Content>
        <Switch>
          {options.routers.map((item, index) => {
            return (
              <Route path={item.path} key={item.path}>
                {item.component}
              </Route>
            );
          })}
          {options.redirect ? <Redirect to={options.redirect} /> : null}
        </Switch>
      </Content>
    </Layout>
  );
}
function getMenu(menus: MenuOption[]) {
  let res = [];
  menus.forEach((item) => {
    if (item.children != null) {
      let children = getMenu(item.children);
      let submenu = (
        <SubMenu key={item.key} icon={icons[item.icon]} title={item.title}>
          {children}
        </SubMenu>
      );
      res.push(submenu);
      return;
    }
    let menu = (
      <Menu.Item key={item.key} icon={icons[item.icon]}>
        <Link to={item.url}>{item.title}</Link>
      </Menu.Item>
    );
    res.push(menu);
  });
  return res;
}
async function login() {
  let res = await axios.get("/user_info");
  if (res.data && res.data.code == 401) {
    let url =
      window.location.hostname === "cloud-staging.d.xiaomi.net"
        ? "http://casdev.mioffice.cn/login"
        : "https://cas.mioffice.cn/login";
    const { protocol, hostname } = window.location;
    url += `?service=${window.encodeURIComponent(
      `${protocol}//${hostname}/logged?path=${window.encodeURIComponent(
        window.location.href
      )}`
    )}`;
    (window as any).location = url;
  } else {
    let org = await axios.get("/org");
    return { ...res.data, ...org.data.default_org };
  }
}

register({
  type: "micloud-sidebar-layout",
  constructor: SidebarLayoutContainer,
});
