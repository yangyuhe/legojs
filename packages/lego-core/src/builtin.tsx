import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import bus from "./bus";
import { GetComponent } from "./component";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";
import { evalExpression, evalOptions, getDependancyFields } from "./util";

export function GetBuiltIn(config: ModuleConfig, scope: string) {
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
      change(name, value) {
        dispatch({
          type: "change",
          payload: {
            scope: scope ? scope + "." + config.name : config.name,
            name,
            value,
          },
        });
      },
    };
  };
  function Component(props) {
    let Com = getComponent(config.type);
    const refs = useMemo(() => {
      if (config.refs) {
        let res = {};
        for (let key in config.refs) {
          res[key] = (config.refs[key] as ModuleConfig[]).map(
            (config, index) => {
              let Com = GetComponent(config, scope, index);
              return <Com key={config.name || index} />;
            }
          );
        }
        return res;
      } else {
        return {};
      }
    }, []);
    const options = evalOptions(config.options, props, refs);

    let [triggers] = useState({});
    const stashTrigger = (name: string, fn: Function) => {
      if (!triggers[name]) triggers[name] = [];
      triggers[name].push(fn);
    };
    useEffect(() => {
      return () => {
        Object.keys(triggers).forEach((trigger) => {
          let fns = triggers[trigger];
          fns.forEach((fn) => {
            bus.unListen(trigger, fn);
          });
        });
      };
    }, []);

    return (
      <Com
        set={(name: string, value: any) => {
          if (config.name) {
            props.change(name, value);
          }
        }}
        id={config.id == null ? null : "lego-class " + config.id}
        {...props}
        emit={(event: string, ...data: any[]) => {
          if (config.name) {
            bus.emit(
              scope
                ? scope + "." + config.name + "." + event
                : config.name + "." + event,
              ...data
            );
          }
        }}
        on={(event: string, fn: Function) => {
          if (config.triggers && config.triggers[event]) {
            stashTrigger(config.triggers[event], fn);
            bus.listen(
              scope
                ? scope + "." + config.triggers[event]
                : config.triggers[event],
              fn
            );
          }
        }}
        options={options}
      ></Com>
    );
  }
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
