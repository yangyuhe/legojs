import React, { useState } from "react";
export default function MockAjax(props) {
  let [todos, setTodos] = useState([]);
  props.on("send", function () {
    if (props.options.url == "/api/todo" && props.options.method == "POST") {
      todos.concat();
    }
  });
  return <></>;
}
