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
  children: { [name: string]: any }
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
          if (children[ref]) {
            res[key] = children[ref];
            continue;
          }
        }
        res[key] = obj[key];
        continue;
      }
      res[key] = evalOptions(obj[key], expValues, children);
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
          if (children[ref]) {
            res.push(children[ref]);
            return;
          }
        }
        res.push(item);
      } else {
        res.push(evalOptions(item, expValues, children));
      }
    });
    return res;
  }
  return obj;
}
export function evalExpression(expression: string, context: any) {
  let res;
  if ((res = expression.match(/^\${(.+)}$/))) {
    return withStatement(context, res[1]);
  } else {
    return expression;
  }
}
export function getDependancyFields(obj): string[] {
  let depends: string[] = [];
  if (isObject(obj)) {
    for (let key in obj) {
      if (typeof obj[key] == "string") {
        let reg = /^\${(.+)}$/g;
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
        let reg = /^\${(.+)}$/g;
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
    if (config.children) {
      Object.keys(config.children).forEach((key) => {
        if (!Array.isArray(config.children[key])) {
          config.children[key] = [config.children[key] as any];
        }
        config.children[key] = transformArray(config.children[key]);
      });
    }
  });
  return configs;
}
