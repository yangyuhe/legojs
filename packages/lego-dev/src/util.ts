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
