import React from "react";
import { LegoProps, register } from "@lego/core";
import { Form, Input, Checkbox, Button } from "antd";
import axios from "axios";
import { useHistory } from "react-router-dom";
export interface LoginOption {}
function Login(props: LegoProps<LoginOption>) {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 12 },
  };
  const history = useHistory();
  const onFinish = (value) => {
    axios.post("/api/login", value).then((res) => {
      history.push("/home");
    });
  };
  const onFinishFailed = () => {};
  return (
    <Form
      {...layout}
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ padding: "20px" }}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
register({ type: "cloud-login", constructor: Login });
