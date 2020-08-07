import React, { useMemo, useState, useEffect } from "react";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";
import bus from "./bus";
import { connect } from "react-redux";
import { withStatement, lexicalParse, CopyObject, State } from "./util";

function setRefsInOptions(config: ModuleConfig, options: any): void {
  if (options && typeof options == "object") {
    for (let key in options) {
      if (typeof options[key] == "string") {
        if (options[key].startsWith("@")) {
          let ref = options[key].slice(1);
          if (config.refs && config.refs[ref]) {
            let refModule = config.refs[ref];
            refModule = Array.isArray(refModule) ? refModule : [refModule];
            options[key] = (runArgs) => {
              return (refModule as ModuleConfig[]).map((config, index) => {
                let Com = GetComponent(config, runArgs);
                return <Com key={config.key || index} />;
              });
            };
          }
        }
      } else {
        setRefsInOptions(config, options[key]);
      }
    }
  }
}

function setDataInOptions(obj: any, { state }): any {
  if (obj && typeof obj == "object") {
    for (let key in obj) {
      if (typeof obj[key] == "string") {
        let res;
        if ((res = obj[key].match(/^\${([^}]+)}$/))) {
          obj[key] = withStatement(state, res[1]);
        } else {
          let variables = obj[key].match(/\${[^}]+}/g);
          if (variables) {
            let litrals = obj[key].split(/\${[^}]+}/);
            let res = "";
            for (let i = 0; i < variables.length; i++) {
              let name = variables[i].substring(2, variables[i].length - 1);
              res = res + litrals[i] + withStatement(state, name);
            }
            res = res + litrals[litrals.length - 1];
            obj[key] = res;
          }
        }
      } else {
        setDataInOptions(obj[key], state);
      }
    }
  }
}
function bindFnInOptions(obj: any, cache: any, depends: string[]): any {
  if (obj && typeof obj == "object") {
    for (let key in obj) {
      if (typeof obj[key] == "function") {
        obj[key] = obj[key].bind({
          getState: (name) => {
            if (depends.indexOf(name) == -1) {
              depends.push(name);
            }
            return cache.state[name];
          },
        });
      } else {
        bindFnInOptions(obj[key], cache, depends);
      }
    }
  }
}

function getDependancy(obj): string[] {
  let depends: string[] = [];
  if (obj && typeof obj == "object") {
    for (let key in obj) {
      if (typeof obj[key] == "string") {
        let reg = /\${([^}]+)}/g;
        let res = reg.exec(obj[key]);
        while (res) {
          let { identifiers } = lexicalParse(res[1], State.idle, 0);
          depends = depends.concat(identifiers);
          res = reg.exec(obj[key]);
        }
        continue;
      }
      depends = depends.concat(getDependancy(obj[key]));
    }
  }
  return Array.from(new Set(depends));
}
export function GetComponent(item: ModuleConfig, runArgs?: any) {
  let depends = item.options ? getDependancy(item.options) : [];
  let cache = { state: null };
  let mapStateToProps = (state) => {
    cache.state = state;
    let map = {};
    depends.forEach((key) => {
      map[key] = state[key];
    });
    return map;
  };
  let mapDispatchToProps = (dispatch) => {
    return {
      change(name, value) {
        dispatch({ type: "change", payload: { [name]: value } });
      },
    };
  };
  function Component(props) {
    let Com = getComponent(item.type);

    let options = null;
    if (item.options) {
      let opt = CopyObject(item.options);
      if (depends.length > 0) setDataInOptions(opt, cache);
      bindFnInOptions(opt, cache, depends);
      setRefsInOptions(item, opt);
      options = opt;
    }

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
          if (item.states && item.states[name]) {
            props.change(item.states[name], value);
          }
        }}
        id={item.id == null ? null : "lego-class " + item.id}
        {...props}
        emit={(event: string, ...data: any[]) => {
          if (item.emits && item.emits[event]) {
            bus.emit(item.emits[event], ...data);
          }
        }}
        on={(event: string, fn: Function) => {
          stashTrigger(item.triggers[event], fn);
          if (item.triggers && item.triggers[event])
            bus.listen(item.triggers[event], fn);
        }}
        options={options}
        runArgs={runArgs}
      ></Com>
    );
  }
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
