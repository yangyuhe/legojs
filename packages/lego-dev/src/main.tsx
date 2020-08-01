import { Lego, ModuleConfig } from "@lego/core";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Console } from "./console";
import "./index.less";
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from "./redux/store";
import { Action } from "./redux/action";

function LegoDev(props: { configs: ModuleConfig[] }) {
  let embed = location.hash == "#embed";
  if (embed) {
    return <Embed configs={props.configs} />;
  } else {
    const dispatch = useDispatch();
    const configs: ModuleConfig[] = useSelector(
      (store) => store.config.configs
    );
    useEffect(() => {
      let initConfig = props.configs;
      dispatch({ type: Action.INIT_CONFIG, payload: initConfig });
    }, []);

    useEffect(() => {
      if (configs) {
        iframe.current.contentWindow.postMessage({
          type: "lego_change",
          value: JSON.parse(JSON.stringify(configs)),
        });
      }
    }, [configs]);

    let iframe = useRef(null);
    let container = useRef(null);
    const cacluIFrame = useCallback(() => {
      if (container.current) {
        let width = container.current.offsetWidth;
        let height = container.current.offsetHeight;
        if (height / width > 0.625) {
          iframe.current.style.width = width - 40 + "px";
          iframe.current.style.height = (width - 40) * 0.625 + "px";
        } else {
          if (height / width < 0.625) {
            iframe.current.style.width = (height - 40) / 0.625 + "px";
            iframe.current.style.height = height - 40 + "px";
          }
        }
      }
    }, []);
    useEffect(() => {
      cacluIFrame();
      window.addEventListener("resize", cacluIFrame);
      return () => {
        window.removeEventListener("resize", cacluIFrame);
      };
    }, []);

    return (
      <div className="lego-dev">
        <Console />
        <div ref={container} className="lego-dev-container">
          <iframe ref={iframe} frameBorder="none" src="/#embed"></iframe>
        </div>
      </div>
    );
  }
}
function Embed(props: { configs: ModuleConfig[] }) {
  let [configs, setConfigs] = useState(props.configs);
  useEffect(() => {
    window.addEventListener("message", (evt) => {
      if (evt.data && evt.data.type === "lego_change") {
        setConfigs(evt.data.value);
      }
    });
  }, []);
  return configs ? <Lego config={configs}></Lego> : null;
}
export default function Wrapper(props) {
  return (
    <Provider store={Store}>
      <LegoDev {...props} />
    </Provider>
  );
}
