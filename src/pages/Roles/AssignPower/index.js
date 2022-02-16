import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Tree, Menu } from 'antd';
import { Roles, Users, Rights } from 'services/api';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import './styles.less';
/**
 * 添加用户界面
 */

export default function FCAssignPower(props) {
  /**
   * 页面状态和方法
   */
  const [powerData, setPowerData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [rightsData, setRightsData] = useState([]);

  // 获取所有权限的列表
  async function fetchRightsData() {
    const { data, meta } = await Rights('get', '/tree');
    if (meta.status !== 200) return message.error(meta.msg);
    message.success(meta.msg);
    convertData(data)
    setRightsData(data);
  }

  // 将数据转换成 tree组件 需要的格式
  function convertData(data) {
    data?.forEach((el, idx, arr) => {
      arr[idx] = { title: el.authName, key: el.id, children: el.children };
      if (el.children) convertData(el.children);
    });
  }

  // 将已有权限转换成 key 数组，用于 tree组件 默认选中项
  function convertKey(data, arr) {
    data?.forEach(el => {
      arr.push(el.id)
      if (el.children) convertKey(el.children, arr)
    })
  }

  // 提交分配角色
  async function assignPower(values) {
    const { meta } = await Roles('post', `/${props.data.id}/rights`, {
      rids: selectedItem,
    });
    if (meta.status !== 200) return message.error(meta.msg);
    message.success(meta.msg);
    props.reloadData();
    props.toggleVisible();
  }

  /**
   * 页面事件
   */

  function onCheck(checkedKeys) {
    setPowerData(checkedKeys);
    setSelectedItem(checkedKeys.join(','))
  }

  /**
   * 页面组件相关配置
   */

  /**
   *  页面副作用
   */

  useEffect(() => {
    let _data = []
    convertKey(props.data.children, _data)
    setPowerData(_data)
    fetchRightsData()
  }, []);

  return (
    <Modal
      title="分配权限"
      visible
      onOk={assignPower}
      onCancel={props.toggleVisible}
      width="50vw"
      centered="true"
      bodyStyle={{ height: '50vh', overflowY: 'scroll' }}
    >
      <Tree
        checkable
        onCheck={onCheck}
        checkedKeys={powerData}
        treeData={rightsData}
      />
    </Modal>
  );
}
