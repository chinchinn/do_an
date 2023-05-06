import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import FormBuilder from "antd-form-builder";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import React, { Component, useEffect, useRef, useState } from "react";

function SignInV2(props) {
  const [form] = Form.useForm();

  const handleFinish = useCallback((values) => {
    props.onSignIn(values);
    form.resetFields();
    console.log("Submit: ", values);
  });

  const handleSignInNow = (value) => {
    props.onSignInNowClick(value);
  };

  const meta = {
    fields: [
      {
        key: "username",
        label: "User Name",
        rules: [
          {
            required: true,
            message: "Xin vui lòng nhập tài khoản!",
          },

          {
            whitespace: true,
            message: "Tài khoản toàn là dấu cách!",
          },
        ],
        hasFeedback: true,
      },

      { key: "password", label: "Password", widget: "password" },
    ],
  };

  return (
    <Form
      form={form}
      name="normal_login"
      className="login-form"
      initialValues={{ username: "", password: "", remember: false }}
      onFinish={handleFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Xin vui lòng nhập tài khoản!",
          },

          {
            whitespace: true,
            message: "Tài khoản toàn là dấu cách!",
          },
        ]}
        hasFeedback
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Xin vui lòng nhập mật khẩu!",
          },
          {
            min: 10,
            message: "Mật khẩu phải có 10 ký tự trở lên!",
          },
          {
            whitespace: true,
            message: "Mật khẩu toàn là dấu cách!",
          },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Nhớ tài khoản? </Checkbox>
        </Form.Item>

        <Link
          onClick={() => handleSignInNow("3")}
          className="login-form-forgot"
          to="#"
        >
          Quên mật khẩu
        </Link>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          style={{
            height: "45px",
            border: "1px solid #fadb14",
            backgroundColor: "#fadb14",
            textTransform: "uppercase",
            fontSize: 16,
            fontWeight: "bold",
          }}
          htmlType="submit"
          className="login-form-button"
        >
          ĐĂNG NHẬP
        </Button>
      </Form.Item>
    </Form>
  );
}
export default SignInV2;
