import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Roles } from 'services/api';
/**
 * 添加角色弹窗
 */

export default function FCAddRole(props) {
  /**
   * 页面状态和方法
   */

  async function addUser(values) {
    const { meta } = await Roles('post', values);
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

  return (
    <Modal
      title="添加角色"
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
        <Form.Item label="角色名称" name="roleName" required>
          <Input />
        </Form.Item>

        <Form.Item label="角色描述" name="roleDesc">
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}
