import React, { useMemo } from "react";
import { connect } from "react-redux";
import { GetComponent } from "./component";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";
import { evalExpression, evalOptions, getDependancyFields } from "./util";

export function GetCustom(config: ModuleConfig, scope: string, index: number) {
  let mapStateToProps = (state) => {
    let depends = getDependancyFields(config.options);
    let cur = state;
    if (scope) {
      let paths = scope.split(".");
      paths.forEach((path) => {
        if (cur) cur = cur[path];
        else cur = {};
      });
    }
    if (!cur) cur = {};
    let map: { [key: string]: any } = {};
    depends.forEach((exp) => {
      map[exp] = evalExpression(exp, cur);
    });
    return map;
  };
  let mapDispatchToProps = (dispatch) => {
    return {
      changeProps(name, value) {
        dispatch({
          type: "change",
          payload: {
            scope: scope
              ? scope + "." + (config.name || index)
              : config.name || "" + index,
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
        let Com = GetComponent(
          item,
          scope
            ? scope + "." + (config.name || index)
            : config.name || "" + index,
          subIndex
        );
        return <Com key={item.name || subIndex}></Com>;
      });
    }, []);
    return <>{children}</>;
  }

  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
