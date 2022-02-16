import React, { memo } from 'react';
import './styles.less';
import { Login } from 'services/api';
import { Form, Input, Button, Checkbox, message } from 'antd';

export default memo(function FCLogin(props) {
  // ----- 数据请求 -----

  // ----- 表单的样式控制 -----
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  //----- 表单的行为 -----
  // const [form] = Form.useForm();

  //表单提交成功
  const onFinish = async (values) => {
    let res = await Login(values);
    if (res.meta.status !== 200) return;
    try {
      values.remember && localStorage.setItem('token', res.data.token);
      message.success(res.meta.msg);
      setTimeout(() => {
        props.history.push('/home');
      }, 1000);
    } catch (error) {
      console.log('%cindex.js line:29 error', 'color: #ff0000;', error);
    }
  };

  // 表单提交失败
  const onFinishFailed = (errorInfo) => {
    message.error('表单提交失败');
  };
  return (
    <div className="loginContainer">
      <Form
        {...layout}
        name="basic"
        // form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
