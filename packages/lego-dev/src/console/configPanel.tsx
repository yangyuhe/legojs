import React, { useState, useMemo, useEffect } from "react";
import { Drawer, Button } from "antd";

import AceEditor from "react-ace";
import { useDispatch } from "react-redux";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import { js as jsbeautify } from "js-beautify";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { Action } from "../redux/action";

const ace = require("ace-builds/src-noconflict/ace");
ace.config.setModuleUrl(
  "ace/mode/json_worker",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-noconflict/worker-json.js"
);

const options = {
  indent_size: "4",
  indent_char: " ",
  max_preserve_newlines: "5",
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: "normal",
  brace_style: "collapse",
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: "0",
  indent_inner_html: false,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false,
};
export function ConfigPanel(props: {
  des: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const onChange = function (text) {
    setValue(text);
  };
  const dispatch = useDispatch();

  let des = useMemo(() => {
    return jsbeautify(props.des, options);
  }, []);
  let initValue = useMemo(() => {
    return jsbeautify(props.value, options);
  }, []);
  let [value, setValue] = useState(initValue);

  let save = () => {
    props.onChange(value);
  };
  let title = (
    <div className="config-panel-title">
      组件配置
      <Button className="save" onClick={save} type="primary">
        保存
      </Button>
    </div>
  );
  return (
    <Drawer
      title={title}
      placement="bottom"
      className="config-panel"
      closable={true}
      visible={true}
      height="500"
      onClose={() => {
        dispatch({ type: Action.HIDE_CONFIG_PANEL });
      }}
    >
      <div className="config-panel-content">
        <div className="left">
          <AceEditor
            mode="javascript"
            theme="github"
            value={des}
            readOnly
            height="435px"
            width="100%"
            showPrintMargin={false}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 4,
            }}
          />
        </div>
        <div className="right">
          <AceEditor
            value={value}
            onChange={onChange}
            mode="json"
            theme="github"
            height="435px"
            width="100%"
            showPrintMargin={false}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 4,
            }}
          />
        </div>
      </div>
    </Drawer>
  );
}
