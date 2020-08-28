import React, { useState } from "react";
import { ModuleConfig } from "./interface";
import { GetComponent } from "./component";
import { Provider } from "react-redux";
import store from "./redux/store";
import { transformArray } from "./util";

export function Lego(props: { configs: ModuleConfig[] }) {
  let configs = transformArray(props.configs);
  if (!Array.isArray(configs)) {
    configs = [configs];
  }
  return (
    <Provider store={store}>
      {configs.map((item, index) => {
        let Com = GetComponent(item, "", index);
        return <Com key={item.name || index}></Com>;
      })}
    </Provider>
  );
}
