import React, { useState, useEffect } from "react";
import { LegoProps, register } from "@lego/core";
import { Input } from "antd";
export interface InputOption {
  label: string;
}
function LegoInput(props: LegoProps<InputOption>) {
  let [value, setValue] = useState("");
  useEffect(() => {
    props.set("value", "");
  }, []);
  const onChange = (evt) => {
    setValue(evt.target.value);
    props.set("value", evt.target.value);
  };
  if (props.options.label) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "5px", whiteSpace: "nowrap" }}>
          {props.options.label}
        </span>
        <Input value={value} onChange={onChange} />
      </div>
    );
  } else {
    return <Input value={value} onChange={onChange} />;
  }
}
register({ type: "lego-input", constructor: LegoInput });
