export function Merge<T>(target: T, source: T): T {
  if (isObject(target) && isObject(source)) {
    let res = {};
    Object.keys(source).forEach((key) => {
      res[key] = Merge(target[key], source[key]);
    });
    return res as T;
  } else {
    if (source == null) return target;
    return source;
  }
}
export function isObject(obj) {
  return Object.prototype.toString.call(obj) == "[object Object]";
}

function CopyObject(obj: any) {
  if (isObject(obj)) {
    let res = {};
    Object.keys(obj).forEach((key) => {
      if (isObject(obj[key])) {
        res[key] = CopyObject(obj[key]);
        return;
      }
      if (Array.isArray(obj[key])) {
        res[key] = obj[key].map((item) => CopyObject);
        return;
      }
      res[key] = obj[key];
    });
    return res;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => CopyObject(item));
  }
  return obj;
}
