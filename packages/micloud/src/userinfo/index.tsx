import React from "react";
import { LegoProps, register } from "@lego/core";
import axios from "axios";
function UserInfo(props: LegoProps<void>) {
  axios.get("/api/user").then((res) => {
    props.set("userinfo", res.data);
    props.set("logined", true);
  });
  return <></>;
}
register({ type: "cloud-userinfo", constructor: UserInfo });
