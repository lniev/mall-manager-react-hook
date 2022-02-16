import React, { memo, useState, useEffect } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { Card, Input, Table, Space, message, Tag } from 'antd';
import { Rights } from 'services/api';

export default memo(function FCRights() {
  /**
   * 页面的状态和方法
   */

  const [tableData, setTableData] = useState([]);
  const [_tmpData] = useState({});
  async function fetchData() {
    const { data, meta } = await Rights('get', '/list');
    if (meta.status !== 200) return message.error(meta.msg);
    message.success(meta.msg);
    setTableData(data);
  }

  /**
   *  页面相关操作
   */

  function handleSearch(val) {
    if (!val) return setTableData(_tmpData.data);
    let filterData = tableData.filter((el) => el.authName.indexOf(val) > -1);
    _tmpData.data = tableData;
    setTableData(filterData);
  }

  /**
   * 副作用
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 页面相关的配置
   */
  const columns = [
    {
      title: '权限名称',
      dataIndex: 'authName',
      key: 'id',
      // width: '25vw',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'id',
      // width: '25vw',
    },
    {
      title: '权限等级',
      dataIndex: 'level',
      key: 'id',
      // width: '25vw',
      render: (level, record, index) => {
        return (
          <>
            {level == 0 && (
              <Tag key={record.id + index} color="blue">
                一级
              </Tag>
            )}
            {level == 1 && (
              <Tag key={record.id + index} color="green">
                二级
              </Tag>
            )}
            {level == 2 && (
              <Tag key={record.id + index} color="orange">
                三级
              </Tag>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Breadcrumb items={[{ path: '/home/rights', label: '权限列表' }]}></Breadcrumb>
      <Card className="content-card">
        <Space size="middle" style={{ marginBottom: '15px' }}>
          <Input.Search
            allowClear
            placeholder="请输入"
            enterButton
            style={{ width: '280px' }}
            onSearch={handleSearch}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={{ pageSize: 100, position: ['none', 'none'] }}
          scroll={{ y: 'calc(100vh - 295px )' }}
          bordered
          className="box-shadow1"
        />
      </Card>
    </div>
  );
});
