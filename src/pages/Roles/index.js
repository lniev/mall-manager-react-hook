import './styles.less';
import React, { memo, useState, useEffect, useRef } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { Card, Input, Col, Row, Table, Tag, Space, message, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Roles } from 'services/api';

import AddRole from './AddRole';
import EidtRole from './EditRole';
import AssignPower from './AssignPower';

export default memo(function FCRoles() {
  /**
   * 页面属性和方法
   */

  const [tableData, setTableData] = useState([]); // 表格数据

  // 拉取角色的数据
  async function fetchData(params) {
    const { data, meta } = await Roles('get');
    if (meta.status !== 200) {
      message.error(meta.msg);
      return false;
    }
    setTableData(data);
    console.log('%cindex.js line:27 object', 'color: #007acc;', data);
    return true;
  }
  async function deletdRolesById(roleId, rightId) {
    const { meta } = await Roles('del', `/${roleId}/rights/${rightId}`);
    if (meta.status !== 200) return message.error(meta.msg);
    message.success(meta.msg);
    fetchData();
  }

  /**
   * 页面的动作
   */

  /**
   * 添加角色
   */

  const [addRoleVisible, setAddRoleVisible] = useState(false); // 控制添加角色弹窗的显示与隐藏

  /**
   * 编辑角色
   */

  const [editRoleVisible, setEditRoleVisible] = useState(false); // 控制编辑角色弹窗的显示与隐藏
  const [editRoleData, setEditRoleData] = useState({}); // 保存角色信息传递给弹出层

  /**
   * 分配角色
   */

  const [assignPowerVisible, setAssignPowerVisible] = useState(false); // 控制编辑角色弹窗的显示与隐藏

  /**
   * 删除角色
   */

  async function handleDelete(record) {
    Modal.confirm({
      title: '确认删除此角色?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      centered: true,
      onOk() {
        Roles('del', '/' + record.id)
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
   * 副作用
   */

  useEffect(() => {
    if (fetchData()) message.success('获取角色列表成功');
  }, []);

  /**
   * 页面组件的相关配置
   */
  // 表格配置
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setEditRoleData(record);
              setEditRoleVisible(true);
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
              setEditRoleData(record);
              setAssignPowerVisible(true);
            }}
          >
            分配
          </Button>
        </Space>
      ),
    },
  ];
  // 列表展开项
  const expendeRowRender = (record) => {
    return record.children.map((el, idx) => {
      return (
        // 每一行
        <Row
          key={el.id}
          style={{
            borderBottom: '1px solid #ccc',
            borderTop: idx === 0 && '1px solid #ccc',
            margin: '0 40px',
            padding: '0 20px',
          }}
        >
          {/* 第一列 */}
          <Col span="5" className="tag-warpper">
            <Tag
              color="blue"
              closable
              className="tag-items"
              onClose={() => deletdRolesById(record.id, el.id)}
            >
              {el.authName}
            </Tag>
          </Col>
          {/* 第二&三列 */}
          <Col span="19">
            {el.children.map((cel, idy) => (
              <div
                style={{ borderBottom: idy !== el.children.length - 1 && '1px solid #ccc' }}
                className="tag-warpper"
                key={cel.id}
              >
                {/* 第二列 */}
                <Col span="6" className="tag-warpper">
                  <Tag
                    color="green"
                    closable
                    className="tag-items"
                    onClose={() => deletdRolesById(record.id, cel.id)}
                  >
                    {cel.authName}
                  </Tag>
                </Col>
                {/* 第三列 */}
                <Col span="18" className="tag-warpper">
                  {cel.children.map((ccel) => (
                    <Tag
                      key={ccel.id}
                      color="orange"
                      closable
                      className="tag-items"
                      onClose={() => deletdRolesById(record.id, ccel.id)}
                    >
                      {ccel.authName}
                    </Tag>
                  ))}
                </Col>
              </div>
            ))}
          </Col>
        </Row>
      );
    });
  };

  return (
    <div className="roles">
      <Breadcrumb items={[{ path: '/home/Roles', label: '角色列表' }]} />
      <Card className="content-card">
        <Button
          type="primary"
          onClick={() => setAddRoleVisible(true)}
          style={{ marginBottom: '10px' }}
        >
          添加角色
        </Button>

        <Table
          columns={columns}
          dataSource={tableData}
          bordered
          className="box-shadow1"
          rowKey="id"
          scroll={{ y: 'calc(100vh - 290px )' }}
          pagination={{ position: ['none', 'none'] }}
          expandable={{
            expandedRowRender: expendeRowRender,
            rowExpandable: (record) => record?.children.length !== 0,
            childrenColumnName: 'none', // 消除默认的children属性，防止展开多余空项
          }}
        />
      </Card>
      {addRoleVisible && (
        <AddRole reloadData={fetchData} toggleVisible={() => setAddRoleVisible(!addRoleVisible)} />
      )}

      {editRoleVisible && (
        <EidtRole
          data={editRoleData}
          reloadData={fetchData}
          toggleVisible={() => setEditRoleVisible(!editRoleVisible)}
        />
      )}

      {assignPowerVisible && (
        <AssignPower
          data={editRoleData}
          reloadData={fetchData}
          toggleVisible={() => setAssignPowerVisible(!assignPowerVisible)}
        />
      )}
    </div>
  );
});
