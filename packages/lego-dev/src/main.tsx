import { Lego, ModuleConfig } from "@lego/core";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Console } from "./console";
import "./index.less";
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from "./redux/store";
import { Action } from "./redux/action";
import { StringifyObject, CopyObject } from "./util";

export const DevContext = React.createContext(null);
function LegoDev(props: { configs: ModuleConfig[] }) {
  let embed = location.hash == "#embed";
  if (embed) {
    return <Embed />;
  } else {
    const dispatch = useDispatch();
    const configs: ModuleConfig[] = useSelector(
      (store) => store.config.configs
    );
    useEffect(() => {
      let initConfig = props.configs;
      dispatch({ type: Action.INIT_CONFIG, payload: initConfig });
    }, []);

    const postMessage = (msg: { type: string; value: any }) => {
      let str = StringifyObject(msg.value);
      iframe.current.contentWindow.postMessage({ type: msg.type, value: str });
    };
    useEffect(() => {
      if (configs) {
        postMessage({
          type: "lego_change",
          value: configs,
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
    const onIFrameLoad = () => {
      postMessage({
        type: "lego_change",
        value: configs,
      });
    };

    return (
      <DevContext.Provider value={{ postMessage }}>
        <div className="lego-dev">
          <Console />
          <div ref={container} className="lego-dev-container">
            <iframe
              onLoad={onIFrameLoad}
              ref={iframe}
              frameBorder="none"
              src="/#embed"
            ></iframe>
          </div>
        </div>
      </DevContext.Provider>
    );
  }
}
function Embed() {
  let [configs, setConfigs] = useState([]);
  useEffect(() => {
    let cbs = [];
    window.addEventListener("message", (evt) => {
      if (evt.data && evt.data.type === "lego_change") {
        let config = new Function("return " + evt.data.value)();
        setConfigs(config);
      }
      if (evt.data && evt.data.type === "lego_tree_focus") {
        let moduleDoms = document.querySelectorAll(".lego-class");
        cbs = [].slice
          .call(moduleDoms, 0)
          .filter((dom) => {
            return [].slice
              .call(dom.classList, 0)
              .find(
                (name) =>
                  name == evt.data.value ||
                  name.startsWith(evt.data.value + "-")
              );
          })
          .map((dom) => {
            let { left, top } = getPos(dom);
            let div = document.createElement("div");
            div.style.position = "fixed";
            div.style.left = left + "px";
            div.style.top = top + "px";
            div.style.width = dom.offsetWidth + "px";
            div.style.height = dom.offsetHeight + "px";
            div.style.background = "rgba(40,120,201,0.5)";
            document.body.append(div);
            return () => {
              div.remove();
            };
          });
      }
      if (evt.data && evt.data.type === "lego_tree_blur") {
        cbs.forEach((cb) => cb());
      }
    });
  }, []);
  return configs ? <Lego config={configs}></Lego> : null;
}
function getPos(dom: HTMLElement) {
  let top = dom.offsetTop;
  let cur = dom;
  while (cur.offsetParent) {
    cur = cur.offsetParent as HTMLElement;
    top += cur.offsetTop;
  }
  let left = dom.offsetLeft;
  cur = dom;
  while (cur.offsetParent) {
    cur = cur.offsetParent as HTMLElement;
    top += cur.offsetLeft;
  }
  return { left, top };
}
export default function Wrapper(props) {
  return (
    <Provider store={Store}>
      <LegoDev {...props} />
    </Provider>
  );
}
