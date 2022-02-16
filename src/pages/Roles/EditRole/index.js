import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Roles } from 'services/api';
import { connect } from 'react-redux';
import { fetchAllRightsList } from 'store/actionCreators'

/**
 * 添加角色弹窗
 */

function FCEditRole(props) {
  /**
   * 页面状态和方法
   */

  async function editRole(values) {
    const { meta } = await Roles('put', `/${props.data.id}`, values);
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
    required: '请输入${label}',
    types: {
      email: '${label}不正确',
    },
  };
  console.log('%cindex.js line:42 object', 'color: #007acc;', props.data);
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
        name="editRole"
        form={form}
        validateTrigger="onBlur"
        validateMessages={validateMessages}
        onFinish={editRole}
        initialValues={props.data}
      >
        <Form.Item label="角色名称" name="roleName" required>
          <Input />
        </Form.Item>

        <Form.Item label="角色描述" name="roleDesc">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}



const mapStateToProps = (state) => ({ allRightList: state.RightReducer.allRightList })
const mapDispatchToProps = (dispatch) => ({ fetchRightsList: () => dispatch(fetchAllRightsList()) })
export default connect(mapStateToProps, mapDispatchToProps)(FCEditRole)