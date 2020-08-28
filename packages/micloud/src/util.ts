export function Merge<T>(target: T, source: T): T {
  if (isObject(target) && isObject(source)) {
    let res = Object.assign({}, target);
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
