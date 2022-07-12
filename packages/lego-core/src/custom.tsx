import React, { useMemo } from "react";
import { connect } from "react-redux";
import { GetComponent, AttachScope, GetScopeName } from "./component";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";
import { evalExpression, evalOptions, getDependancyFields } from "./util";

export function GetCustom(config: ModuleConfig, scope: string) {
  let mapStateToProps = (state) => {
    let depends = getDependancyFields(config.options);
    let cur = Object.assign({}, scope ? state[scope] : state);
    cur = AttachScope(cur, state);
    let map: { [key: string]: any } = {};
    depends.forEach((exp) => {
      map[exp] = evalExpression(exp, cur);
    });
    return map;
  };
  let customScope = config.scope || GetScopeName();
  let mapDispatchToProps = (dispatch) => {
    return {
      changeProps(name, value) {
        dispatch({
          type: "change",
          payload: {
            scope: customScope,
            name,
            value,
          },
        });
      },
    };
  };
  function Component(props) {
    if (config.options) {
      let options = evalOptions(config.options, props, {});
      props.changeProps("$props", options);
    }
    let children = useMemo(() => {
      let configs = getComponent(config.type);
      return configs.map((item, subIndex) => {
        let Com = GetComponent(item, customScope);
        return <Com key={item.name || subIndex}></Com>;
      });
    }, []);
    return <>{children}</>;
  }

  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
