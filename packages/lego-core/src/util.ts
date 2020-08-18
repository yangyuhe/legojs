export function StringifyObject(obj: any): string {
  if (Object.prototype.toString.call(obj) == "[object Array]") {
    let res = "[";
    obj.forEach((item) => {
      res += StringifyObject(item) + ",";
    });
    if (res.endsWith(",")) {
      res = res.slice(0, res.length - 1);
    }
    return res + "]";
  }
  if (Object.prototype.toString.call(obj) == "[object String]") {
    return '"' + obj + '"';
  }
  if (Object.prototype.toString.call(obj) != "[object Object]") return "" + obj;
  let res = "{";
  for (let key in obj) {
    let value = obj[key];
    switch (Object.prototype.toString.call(value)) {
      case "[object String]":
        value = '"' + value + '"';
        break;
      case "[object Array]":
      case "[object Object]":
        value = StringifyObject(value);
        break;
    }
    res += key + ":" + value + ",";
  }
  if (res.endsWith(",")) {
    res = res.slice(0, res.length - 1);
  }
  res += "}";
  return res;
}
export function CopyObject(obj: any) {
  let str = StringifyObject(obj);
  return new Function("return " + str)();
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
        if (exps.indexOf(obj[key]) > -1) res[key] = expValues[obj[key]];
        if (obj[key].startsWith("@")) {
          let ref = obj[key].slice(1);
          if (refs[ref]) {
            res[key] = refs[ref];
          }
        }
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
        if (exps.indexOf(item) > -1) res.push(expValues[item]);
        if (item.startsWith("@")) {
          let ref = item.slice(1);
          if (refs[ref]) {
            res.push(refs[ref]);
          }
        }
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
