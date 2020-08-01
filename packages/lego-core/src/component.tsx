import React, { useMemo, useState, useEffect } from "react";
import { ModuleConfig } from "./interface";
import { getComponent } from "./register";
import bus from "./bus";
import { connect } from "react-redux";

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
function withStatement(context, express) {
  let fn = new Function("context", `with(context){return ${express}}`);
  return fn(context);
}
function setDataInOptions(obj: any, datas: any): any {
  if (obj && typeof obj == "object") {
    for (let key in obj) {
      if (typeof obj[key] == "string") {
        let res;
        if ((res = obj[key].match(/^\${([^}]+)}$/))) {
          obj[key] = withStatement(datas, res[1]);
        } else {
          let variables = obj[key].match(/\${[^}]+}/g);
          if (variables) {
            let litrals = obj[key].split(/\${[^}]+}/);
            let res = "";
            for (let i = 0; i < variables.length; i++) {
              let name = variables[i].substring(2, variables[i].length - 1);
              res = res + litrals[i] + datas[name];
            }
            res = res + litrals[litrals.length - 1];
            obj[key] = res;
          }
        }
      } else {
        setDataInOptions(obj[key], datas);
      }
    }
  }
}
enum State {
  identifier,
  quote_single,
  quote_double,
  idle,
}
/**这个地方利用简单的词法分析找出表达式中的变量 */
function lexicalParse(
  express: string,
  initialState: State,
  cursor: number
): { endIndex: number; identifiers: string[] } {
  let i = cursor;
  let state = initialState;
  let identifiers: string[] = [];
  let cache = [];
  while (i < express.length) {
    if (
      state == State.idle &&
      /\w/.test(express[i]) &&
      !/\d/.test(express[i])
    ) {
      cache.push(express[i]);
      state = State.identifier;
      i++;
      continue;
    }
    if (state == State.identifier && /\w/.test(express[i])) {
      cache.push(express[i]);
      i++;
      continue;
    }
    if (state == State.identifier && !/\w/.test(express[i])) {
      identifiers.push(cache.join(""));
      cache = [];
      state = State.idle;
      continue;
    }
    if (
      (state != State.quote_double && express[i] == '"') ||
      (state != State.quote_single && express[i] == "'")
    ) {
      let { endIndex } = lexicalParse(
        express,
        express[i] == '"' ? State.quote_double : State.quote_single,
        i + 1
      );
      i = endIndex;
      continue;
    }
    if (
      (state == State.quote_single && express[i] == "'") ||
      (state == State.quote_double && express[i] == '"')
    ) {
      return { endIndex: i + 1, identifiers: [] };
    }
    i++;
  }
  if (state == State.identifier && cache.length > 0) {
    identifiers.push(cache.join(""));
    state = State.idle;
  }
  if (state != State.idle) throw new Error("express syntax error," + express);
  return { endIndex: i, identifiers: identifiers };
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
      } else depends = depends.concat(getDependancy(obj[key]));
    }
  }
  return Array.from(new Set(depends));
}
export function GetComponent(item: ModuleConfig, runArgs?: any) {
  let depends = item.options ? getDependancy(item.options) : [];
  let mapStateToProps = (state) => {
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
    let options = useMemo(
      () => {
        if (!item.options) return item.options;
        let opt = JSON.parse(JSON.stringify(item.options));
        if (depends.length > 0) setDataInOptions(opt, props);
        setRefsInOptions(item, opt);
        return opt;
      },
      depends.map((item) => props[item])
    );
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
