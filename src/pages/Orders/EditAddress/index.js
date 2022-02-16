import React, { memo, useState, useRef } from 'react';
import { Form, Input, Cascader, message, Modal } from 'antd';
import cityData from 'components/AreaSelectCascader/cityData';

// ！！！ 编辑地址的这个功能api文档不全，这里只模拟了该功能
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
      title="修改地址"
      centered="true"
      width="50vw"
      onOk={form.submit}
      onCancel={props.toggleVisible}
    >
      <Form
        {...layout}
        form={form}
        name="eidtAddress"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="省市区/县"
          name="area"
          rules={[{ required: true, message: '请选择地区!' }]}
        >
          <Cascader options={cityData} placeholder="请选择地区"></Cascader>
        </Form.Item>
        <Form.Item
          label="详细地址"
          name="addr"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input placeholder="请输入详细地址"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
});
