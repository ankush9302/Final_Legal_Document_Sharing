import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import axios from 'axios';
import '../styles/Register.css';

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', values);
      dispatch(setUser({ name: response.data.user.name, role: response.data.user.role }));
      message.success('Registration successful!');
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Create an Account</h2>
        <Form form={form} name="register" onFinish={onFinish} scrollToFirstError layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select a role">
              <Option value="subadmin">Subadmin</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button">
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="register-form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;