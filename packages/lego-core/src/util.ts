import { ModuleConfig } from "./interface";

function withStatement(context, express) {
  let fn = new Function(
    "context",
    `try{
    with(context){return ${express}}
  }catch(err){
    return undefined
  }`
  );
  return fn(context);
}
export function evalOptions(
  obj: any,
  expValues: { [exp: string]: any },
  refs: { [name: string]: any }
): any {
  let exps = Object.keys(expValues);
  if (isObject(obj)) {
    let res = {};
    for (let key in obj) {
      if (typeof obj[key] == "string") {
        if (exps.indexOf(obj[key]) > -1) {
          res[key] = expValues[obj[key]];
          continue;
        }
        if (obj[key].startsWith("@")) {
          let ref = obj[key].slice(1);
          if (refs[ref]) {
            res[key] = refs[ref];
            continue;
          }
        }
        res[key] = obj[key];
        continue;
      }
      res[key] = evalOptions(obj[key], expValues, refs);
    }
    return res;
  }
  if (isArray(obj)) {
    let res = [];
    obj.forEach((item) => {
      if (typeof item == "string") {
        if (exps.indexOf(item) > -1) {
          res.push(expValues[item]);
          return;
        }
        if (item.startsWith("@")) {
          let ref = item.slice(1);
          if (refs[ref]) {
            res.push(refs[ref]);
            return;
          }
        }
        res.push(item);
      } else {
        res.push(evalOptions(item, expValues, refs));
      }
    });
    return res;
  }
  return obj;
}
export function evalExpression(expression: string, context: any) {
  let res;
  if ((res = expression.match(/^\${([^}]+)}$/))) {
    return withStatement(context, res[1]);
  } else {
    let variables = expression.match(/\${[^}]+}/g);
    if (variables) {
      let litrals = expression.split(/\${[^}]+}/);
      let res = "";
      for (let i = 0; i < variables.length; i++) {
        let name = variables[i].substring(2, variables[i].length - 1);
        res = res + litrals[i] + withStatement(context, name);
      }
      res = res + litrals[litrals.length - 1];
      return res;
    }
  }
  return expression;
}
export function getDependancyFields(obj): string[] {
  let depends: string[] = [];
  if (isObject(obj)) {
    for (let key in obj) {
      if (typeof obj[key] == "string") {
        let reg = /\${([^}]+)}/g;
        if (reg.test(obj[key])) {
          depends.push(obj[key]);
        }
        continue;
      }
      let subDepends = getDependancyFields(obj[key]);
      depends = depends.concat(subDepends);
    }
    return depends;
  }
  if (isArray(obj)) {
    obj.forEach((item) => {
      if (typeof item == "string") {
        let reg = /\${([^}]+)}/g;
        if (reg.test(item)) {
          depends.push(item);
        }
        return;
      }
      let subDepends = getDependancyFields(item);
      depends = depends.concat(subDepends);
    });
    return depends;
  }
  return depends;
}
export function isObject(obj) {
  return Object.prototype.toString.call(obj) == "[object Object]";
}
export function isArray(obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
}
export function transformArray(configs: ModuleConfig[]) {
  if (!Array.isArray(configs)) configs = [configs];
  configs.forEach((config) => {
    if (config.refs) {
      Object.keys(config.refs).forEach((key) => {
        if (!Array.isArray(config.refs[key])) {
          config.refs[key] = [config.refs[key] as any];
        }
        config.refs[key] = transformArray(config.refs[key]);
      });
    }
  });
  return configs;
}
