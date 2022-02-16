import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Dropdown, Menu } from 'antd';
import { Roles, Users } from 'services/api';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import './styles.less';
/**
 * 添加用户界面
 */

export default function FCAssignRoles(props) {
  /**
   * 页面状态和方法
   */
  const [rolesList, setRolesList] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  // 加载角色列表
  async function fetchRolesList() {
    const { meta, data } = await Roles('get');
    if (meta.status !== 200) return message.error(meta.msg);
    setRolesList(data);
  }
  // 提交分配角色
  async function assignRoles(values) {
    const { meta } = await Users('put', `/${props.data.id}/role`, {
      rid: selectedItem.id,
    });
    if (meta.status !== 200) return message.error(meta.msg);
    message.success(meta.msg);
    props.reloadData();
    props.toggleVisible();
  }

  /**
   * 页面事件
   */

  /**
   * 页面组件相关配置
   */
  const menu = (
    <Menu
      selectable
      onSelect={(info) => {
        let item = rolesList.filter((el) => el.id == info.key)[0];
        setSelectedItem(item);
      }}
    >
      {rolesList.map((el) => (
        <Menu.Item icon={<UserOutlined />} key={el.id}>
          {el.roleName}
        </Menu.Item>
      ))}
    </Menu>
  );

  /**
   *  页面副作用
   */
  useEffect(() => {
    fetchRolesList();
  }, []);

  return (
    <Modal
      title="分配角色"
      visible
      onOk={assignRoles}
      onCancel={props.toggleVisible}
      width="50vw"
      centered="true"
      bodyStyle={{ height: '50vh' }}
    >
      <div className="label-row">
        当前的用户:<span className="label-item">{props.data.username}</span>
      </div>
      <div className="label-row">
        当前的角色:
        <span className="label-item">{props.data.role_name}</span>
      </div>
      <div className="label-row">
        分配新的角色:
        <Dropdown overlay={menu}>
          <Button className="Dropdown-button">
            {selectedItem.roleName || '选择角色'}
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </Modal>
  );
}
