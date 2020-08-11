import React, { useState } from "react";
import {
  Switch,
  Route,
  BrowserRouter,
  HashRouter,
  Redirect,
} from "react-router-dom";
import { LegoProps, register } from "@lego/core";
import { Merge } from "../util";
export interface CloudRouteOption {
  configs: (
    | {
        path: string;
        component: any;
      }
    | { redirect: string }
  )[];
}
const defaultRouteOption: CloudRouteOption = {
  configs: [],
};
function CloudRoute(props: LegoProps<CloudRouteOption>) {
  let options = Merge(defaultRouteOption, props.options);
  return (
    <Switch>
      {options.configs.map((item, index) => {
        if ((item as any).redirect) {
          return <Redirect key={index} to={(item as any).redirect} />;
        } else {
          item = item as { path: string; component: any };
          return (
            <Route path={item.path} key={item.path}>
              {typeof item.component == "function"
                ? item.component()
                : item.component}
            </Route>
          );
        }
      })}
    </Switch>
  );
}
register({ type: "cloud-route", constructor: CloudRoute });

export interface RouterOption {
  hash: boolean;
  content: any;
}
const defaultRouterOption: RouterOption = {
  hash: true,
  content: null,
};
function CloudRouter(props: LegoProps<RouterOption>) {
  let option = Merge(defaultRouterOption, props.options);
  if (option.hash)
    return (
      <HashRouter>
        {typeof option.content == "function"
          ? option.content()
          : option.content}
      </HashRouter>
    );
  else
    return (
      <BrowserRouter>
        {typeof option.content == "function"
          ? option.content()
          : option.content}
      </BrowserRouter>
    );
}
register({ type: "cloud-router", constructor: CloudRouter });
