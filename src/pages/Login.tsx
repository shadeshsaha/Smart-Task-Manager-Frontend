import { Alert, Button, Form, Input, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../app/store";
import { loginUser } from "../features/auth/authSlice";

const { Title } = Typography;

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const onFinish = (values: { email: string; password: string }) => {
    dispatch(loginUser(values));
  };

  useEffect(() => {
    if (token) {
      // Redirect programmatically when token is available
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // If token exists, redirect immediately
  if (token) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "40px 0" }}>
      <Title level={2}>Smart Task Manager - Login</Title>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
