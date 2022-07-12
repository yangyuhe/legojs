import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import bus from "./bus";
import { GetComponent, AttachScope } from "./component";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";
import { evalExpression, evalOptions, getDependancyFields } from "./util";
import store from "./redux/store";
let id = 0;
export function GetBuiltIn(config: ModuleConfig, scope: string) {
  let _id = id++;
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
  let mapDispatchToProps = (dispatch) => {
    return {
      change(variable, name, value) {
        dispatch({
          type: "change",
          payload: {
            scope,
            variable,
            name,
            value,
          },
        });
      },
    };
  };
  if (config.name) {
    store.dispatch({
      type: "initVariable",
      payload: { scope: scope, variable: config.name },
    });
  }
  function LegoComponent(props) {
    let Com = getComponent(config.type);
    const children = useMemo(() => {
      if (config.children) {
        let res = {};
        for (let key in config.children) {
          res[key] = (config.children[key] as ModuleConfig[]).map(
            (config, index) => {
              let Com = GetComponent(config, scope);
              return <Com key={config.name || index} />;
            }
          );
        }
        return res;
      } else {
        return {};
      }
    }, []);
    const options = evalOptions(config.options, props, children);

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
            props.change(config.name, name, value);
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
            if (typeof config.triggers[event] == "string") {
              let eventName = config.triggers[event] as string;
              stashTrigger(eventName, fn);
              bus.listen(_id, scope ? scope + "." + eventName : eventName, fn);
            } else {
              let trigger = config.triggers[event] as [string, Function];
              stashTrigger(trigger[0], fn);
              bus.listen(
                _id,
                scope ? scope + "." + trigger[0] : trigger[0],
                fn,
                trigger[1]
              );
            }
          }
        }}
        options={options}
      ></Com>
    );
  }
  return connect(mapStateToProps, mapDispatchToProps)(LegoComponent);
}
