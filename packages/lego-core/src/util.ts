export function StringifyObject(obj: any): string {
  if (Object.prototype.toString.call(obj) == "[object Array]") {
    let res = "[";
    obj.forEach((item) => {
      res += StringifyObject(item) + ",";
    });
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
      case "[object Object]":
        value = StringifyObject(value);
        break;
    }
    res += key + ":" + value + ",";
  }
  res += "}";
  return res;
}
export function CopyObject(obj: any) {
  let str = StringifyObject(obj);
  return new Function("return " + str)();
}
export enum State {
  identifier,
  quote_single,
  quote_double,
  idle,
}
/**这个地方利用简单的词法分析找出表达式中的变量 */
export function lexicalParse(
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
export function withStatement(context, express) {
  let fn = new Function("context", `with(context){return ${express}}`);
  return fn(context);
}
