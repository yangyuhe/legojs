import React, { useState } from "react";
import { ModuleConfig } from "./interface";
import { GetComponent } from "./component";
import { Provider } from "react-redux";
import store from "./redux/store";

export function Lego(props: { config: ModuleConfig[] }) {
  let config = props.config;
  if (!Array.isArray(config)) {
    config = [config];
  }
  return (
    <Provider store={store}>
      {config.map((item, index) => {
        let Com = GetComponent(item, "");
        return <Com key={item.key || index}></Com>;
      })}
    </Provider>
  );
}
