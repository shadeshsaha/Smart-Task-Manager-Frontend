import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  message,
  Spin,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { RegisterData } from "../features/auth/authSlice";
import { clearError, registerUser } from "../features/auth/authSlice";

const { Title } = Typography;

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [form] = Form.useForm<RegisterData>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onFinish = (values: RegisterData) => {
    dispatch(registerUser(values)).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        message.success("Registration successful! Redirecting to dashboard...");
        navigate("/");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Spin spinning={loading}>
        <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2}>Register</Title>
            <p>Join Smart Task Manager</p>
          </div>

          {error && (
            <Alert
              message="Registration Error"
              description={error}
              type="error"
              closable
              onClose={() => dispatch(clearError())}
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your full name!" },
                { min: 2, message: "Name must be at least 2 characters!" },
              ]}
            >
              <Input placeholder="Enter your full name" size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="default"
                size="large"
                block
                onClick={() => navigate("/login")}
              >
                Already have an account? Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default Register;
