let list = [];
export function getList() {
  return Promise.resolve().then(() => {
    return list;
  });
}
export function addList(todo) {
  list.push(todo);
  return Promise.resolve();
}
export function deleteList(id) {
  list = list.filter((item) => item.id !== id);
  return Promise.resolve();
}
export function modifyList(todo) {
  list = list.map((item) => {
    if (item.id == todo.id) {
      return { ...item, ...todo };
    }
    return item;
  });
  return Promise.resolve();
}
