let descriptions: { [type: string]: string } = {};
/**
 * 为模块类型添加说明性的描述
 * @param des type是模块类型，des是模块的描述
 */
export function describeModule(
  des: { type: string; des: string } | { type: string; des: string }[]
) {
  if (!Array.isArray(des)) des = [des];
  des.forEach((item) => {
    if (descriptions[item.type]) {
      throw new Error(`dev ${item.type} already exist`);
    }
    descriptions[item.type] = item.des;
  });
}
export function getDescription(type: string) {
  return descriptions[type];
}
