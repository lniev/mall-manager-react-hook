import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Users } from 'services/api';
/**
 * 添加用户界面
 */

export default function FCAddUser(props) {
  /**
   * 页面状态和方法
   */

  async function addUser(values) {
    const { meta } = await Users('post', values);
    if (meta.status !== 201) return message.error(meta.msg);
    message.success(meta.msg);
    props.reloadData();
    props.toggleVisible();
  }
  /**
   * 页面事件
   */

  const handleCancel = () => {
    props.toggleVisible();
  };

  /**
   * 页面组件相关配置
   */
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const validateMessages = {
    required: '请输入${label}',
    types: {
      email: '${label}不正确',
    },
  };
  let rules = {
    moblie: {
      validator: (rule, value, callback) => {
        let regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
        if (!regMobile.test(value)) callback('正确的手机号码');
        callback();
      },
    },
  };

  return (
    <Modal
      title="添加用户"
      visible
      onOk={form.submit}
      onCancel={handleCancel}
      width="50vw"
      centered="true"
      bodyStyle={{ height: '50vh' }}
    >
      <Form
        {...layout}
        name="addUser"
        form={form}
        validateTrigger="onBlur"
        validateMessages={validateMessages}
        onFinish={addUser}
      >
        <Form.Item label="用户名称" name="username" rules={[{ required: true, min: 4, max: 8 }]}>
          <Input />
        </Form.Item>

        <Form.Item label="用户密码" name="password" required rules={[{ min: 6, max: 12 }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item label="邮箱" name="email" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="手机号" name="mobile" rules={[rules.moblie]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
