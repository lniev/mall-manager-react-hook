import './styles.less';
import React, { memo, useState, useEffect } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { Card, Input, Col, Row, Table, Switch, Space, message, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Users } from 'services/api';

import AddUser from './AddUser';
import EidtUser from './EditUser';
import AssignRoles from './AssignRoles';

export default memo(function FCUsers() {
  /**
   * 表格数据更改相关处理
   */

  const [tableData, setTableData] = useState([]); // 表格数据
  const [paginationInfo, setPaginationInfo] = useState({
    pagenum: 1,
    pagesize: 5,
  }); // 分页信息
  const [totalpage, setTotalpage] = useState(0); //数据汇总

  // 拉取用户的数据
  async function fetchData(params) {
    const { data, meta } = await Users('get', params || paginationInfo);
    if (meta.status !== 200) {
      message.error(meta.msg);
      return false;
    }
    setTableData(data.users);
    setTotalpage(data.total);
    return true;
  }

  // 处理搜索
  async function handleSearch(val) {
    const { data, meta } = await Users('get', {
      query: val,
      pagenum: paginationInfo.pagenum,
      pagesize: paginationInfo.pagesize,
    });
    if (meta.status !== 200) return message.error(meta.msg);
    setTableData(data.users);
  }

  // 处理用户状态改变
  async function handleSwitch(text, val, record, index) {
    //请求更改
    const { meta } = await Users('put', `/${record.id}/state/${val}`);
    if (meta.status !== 200) return message.error(meta.msg);
    message.success(meta.msg);
    fetchData();
  }

  // 处理页面尺寸页码改变
  function changePageSize(page, pageSize) {
    setPaginationInfo({
      pagenum: page,
      pagesize: pageSize,
    });
  }

  useEffect(() => {
    fetchData();
  }, [paginationInfo]);

  /**
   * 添加用户
   */

  const [addUserVisible, setAddUserVisible] = useState(false); // 控制添加用户弹窗的显示与隐藏

  /**
   * 编辑用户
   */

  const [editUserVisible, setEditUserVisible] = useState(false); // 控制编辑用户弹窗的显示与隐藏
  const [editUserData, setEditUserData] = useState({}); // 保存用户信息传递给弹出层

  /**
   * 分配角色
   */

  const [assignRolesVisible, setAssignRolesVisible] = useState(false); // 控制编辑用户弹窗的显示与隐藏

  /**
   * 删除用户
   */

  async function handleDelete(record) {
    Modal.confirm({
      title: '确认删除此用户?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      centered: true,
      onOk() {
        Users('del', '/' + record.id)
          .then(({ meta }) => {
            if (meta.status !== 200) return message.error(meta.msg);
            message.success(meta.msg);
            fetchData();
          })
          .catch((err) => {
            message.error('删除请求失败');
          });
      },
    });
  }

  /**
   * 页面组件的相关配置
   */

  const columns = [
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '角色',
      dataIndex: 'role_name',
      key: 'mobile',
    },
    {
      title: '状态',
      dataIndex: 'mg_state',
      key: 'mobile',
      render: (mg_state, record, index) => (
        <Switch
          checked={mg_state}
          onChange={(val) => {
            handleSwitch('mg_state', val, record, index);
          }}
        ></Switch>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setEditUserData(record);
              setEditUserVisible(true);
            }}
          >
            编辑
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#d19a66', borderColor: '#d19a66' }}
            onClick={() => {
              setEditUserData(record);
              setAssignRolesVisible(true);
            }}
          >
            分配
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * 副作用
   */

  useEffect(() => {
    console.log(123);
    if (fetchData()) message.success('获取用户列表成功');
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ path: '/home/users', label: '用户列表' }]} />
      <Card className="content-card">
        <Space size="middle" style={{ marginBottom: '15px' }}>
          <Input.Search
            allowClear
            placeholder="请输入"
            enterButton
            style={{ width: '280px' }}
            onSearch={handleSearch}
          />
          <Button type="primary" onClick={() => setAddUserVisible(true)}>
            添加用户
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            defaultCurrent: paginationInfo.pagenum,
            defaultPageSize: paginationInfo.pagesize,
            total: totalpage,
            onChange: changePageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            hideOnSinglePage: true,
            size: 'small',
            pageSizeOptions: [5, 10, 20, 50],
          }}
          rowKey="id"
          bordered
          className="box-shadow1"
        />
      </Card>
      {addUserVisible && (
        <AddUser reloadData={fetchData} toggleVisible={() => setAddUserVisible(!addUserVisible)} />
      )}
      {editUserVisible && (
        <EidtUser
          data={editUserData}
          reloadData={fetchData}
          toggleVisible={() => setEditUserVisible(!editUserVisible)}
        />
      )}
      {assignRolesVisible && (
        <AssignRoles
          data={editUserData}
          reloadData={fetchData}
          toggleVisible={() => setAssignRolesVisible(!assignRolesVisible)}
        />
      )}
    </div>
  );
});
