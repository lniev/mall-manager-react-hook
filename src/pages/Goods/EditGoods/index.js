import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Goods } from 'services/api';
/**
 * 添加用户界面
 */

export default function FCEditGoods(props) {
  /**
   * 页面状态和方法
   */

  async function editGoods(values) {
    const { meta } = await Goods('put', `/${props.data.goods_id}`, values);
    if (meta.status !== 200) return message.error(meta.msg);
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
      title="编辑商品"
      visible
      onOk={form.submit}
      onCancel={handleCancel}
      width="50vw"
      centered="true"
      bodyStyle={{ height: '50vh' }}
    >
      <Form
        {...layout}
        name="editGoods"
        form={form}
        validateTrigger="onBlur"
        centered
        initialValues={props.data}
        validateMessages={validateMessages}
        onFinish={editGoods}
      >
        <Form.Item label="商品名称" name="goods_name" required>
          <Input />
        </Form.Item>
        <Form.Item label="商品价格" name="goods_price" required>
          <Input />
        </Form.Item>
        <Form.Item label="商品价格" name="goods_price" required>
          <Input />
        </Form.Item>
        <Form.Item label="商品数量" name="goods_number" required>
          <Input />
        </Form.Item>
        <Form.Item label="商品重量" name="goods_weight" required>
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
}
