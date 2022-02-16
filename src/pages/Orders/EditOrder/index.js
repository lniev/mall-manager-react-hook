import React, { memo, useState, useRef } from 'react';
import { Form, Input, Cascader, message, Modal } from 'antd';
import cityData from 'components/AreaSelectCascader/cityData';
import { Orders } from 'services/api';

// TODO 这个待研究，文档不全
export default memo(function FCEditAddress(props) {
  /**
   * 页面状态和方法
   */
  const [form] = Form.useForm();

  /**
   * 页面动作
   */

  function onFinish(form) {
    let _addrstr = form.area.join('');
    _addrstr += form.addr;
    message.success('修改了地址：' + _addrstr);
    props.toggleVisible();
  }
  function onFinishFailed({ values, errorFields, outOfDate }) {
    console.log(
      '%cindex.js line:36 onFinishFailed',
      'color: #007acc;',
      values,
      errorFields,
      outOfDate
    );
  }
  /**
   * 页面组件相关配置
   */

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <Modal
      visible
      title="修改订单信息"
      centered="true"
      width="50vw"
      onOk={form.submit}
      onCancel={props.toggleVisible}
    >
      <Form
        {...layout}
        form={form}
        name="editOrder"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="订单ID" name="id">
          <Input disabled></Input>
        </Form.Item>
        <Form.Item
          label="订单价格"
          name="order_price"
          rules={[
            { required: true, message: '请输入订单价格!' },
            { type: 'number', message: '价格必须为数字' },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="订单数量"
          name="order_number"
          rules={[
            { required: true, message: '请输入订单数量!' },
            { type: 'number', message: '价格必须为数字' },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item label="支付状态" name="pay_status">
          <Input></Input>
        </Form.Item>
        <Form.Item label="订单支付" name="order_pay">
          <Input></Input>
        </Form.Item>
        <Form.Item label="订单是否发货" name="is_send">
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
});
