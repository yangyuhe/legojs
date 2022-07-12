export function Merge<T>(target: T, source: T): T {
  if (isObject(target) && isObject(source)) {
    let res = Object.assign({}, target);
    Object.keys(source).forEach((key) => {
      if (target.hasOwnProperty(key) && source.hasOwnProperty(key)) {
        res[key] = Merge(target[key], source[key]);
        return;
      }
      if (!target.hasOwnProperty(key) && source.hasOwnProperty(key)) {
        res[key] = source[key];
        return;
      }
      if (target.hasOwnProperty(key) && !source.hasOwnProperty(key)) {
        res[key] = target[key];
        return;
      }
    });
    return res as T;
  } else {
    return source;
  }
}
export function isObject(obj) {
  return Object.prototype.toString.call(obj) == "[object Object]";
}
