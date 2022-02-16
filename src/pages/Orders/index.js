import React, { memo, useState, useEffect, useRef } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { Card, Input, Col, Row, Table, Switch, Space, message, Button, Radio, Tag } from 'antd';
import { EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import { Orders } from 'services/api';
import moment from 'moment'

import EditAddress from './EditAddress';
import EditOrder from './EditOrder';
import Logistics from './Logistics';
export default memo(function FCOrders() {
  /**
   * 页面的状态和方法
   */

  const [tableData, setTableData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    pagesize: 5,
    pagenum: 1,
  });
  const [totalPage, setTotalpage] = useState(0);
  const query = useRef({});

  async function fetchData(params) {
    const { data, meta } = await Orders('get', params || paginationInfo);
    if (meta.status !== 200) {
      message.error(meta.msg);
      return false;
    }


    data.goods.forEach(el => {
      el.create_time = moment(el.create_time * 1000).format('YYYY-MM-DD  h:mm:ss')
    })
    setTotalpage(data.total);
    setTableData(data.goods);
    return true;
  }

  /**
   *  页面相关操作
   */

  function handleSearch(val) {
    !val && delete query.current.order_fapiao_company;
    val && (query.current.order_fapiao_company = val);
    fetchData({ ...paginationInfo, ...query.current });
  }

  function changePageSize(pagenum, pagesize) {
    setPaginationInfo({ pagenum, pagesize });
    fetchData({ pagenum, pagesize });
  }

  function handleRadioChange(e, type) {
    if (e.target.value == query.current[type]) return;
    if (e.target.value == -1 && query.current[type]) {
      delete query.current[type];
    } else query.current[type] = e.target.value;
    fetchData({ ...paginationInfo, ...query.current });
  }
  function handleFapiaoTitleChange(e) {
    if (e.target.value == query.current.order_fapiao_title) return;
    if (e.target.value == '全部' && query.current.order_fapiao_title) {
      delete query.current.order_fapiao_title;
    } else query.current.order_fapiao_title = e.target.value;
    fetchData({ ...paginationInfo, ...query.current });
  }

  /**
   * 修改订单
   */

  const [editOrderVisible, setEditOrderVisible] = useState(false);

  /**
   * 修改地址
   */

  const [editAddresVisible, setEditAddresVisible] = useState(false);

  /**
   * 查看物流
   */

  const [logisticsVisible, setLogisticsVisible] = useState(false);

  /**
   * 副作用
   */
  useEffect(() => {
    if (fetchData()) message.success('获取订单列表成功！');
  }, []);

  /**
   * 页面相关的配置
   */
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'order_number',
      key: 'order_number',
      width: '20vw',
    },
    {
      title: '订单价格',
      dataIndex: 'order_price',
      key: 'order_price',
    },
    {
      title: '是否付款',
      dataIndex: 'pay_status',
      key: 'pay_status',
      render: (status) => {
        return (
          <>
            {(Number(status) && <Tag color="green">已付款</Tag>) || <Tag color="red">未付款</Tag>}
          </>
        );
      },
    },
    {
      title: '是否发货',
      dataIndex: 'is_send',
      key: 'is_send',
    },
    {
      title: '下单时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '操作',
      dataIndex: 'operating ',
      key: 'id',
      render: (level, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              type="primary"
              style={{ width: '40px' }}
              onClick={() => setEditAddresVisible(true)}
            ></Button>
            <Button
              icon={<EnvironmentOutlined />}
              className="button-green"
              style={{ width: '40px' }}
              onClick={() => setLogisticsVisible(true)}
            ></Button>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Breadcrumb items={[{ path: '/home/orders', label: '订单列表' }]}></Breadcrumb>
      <Card>
        <Space size="middle" style={{ marginBottom: '15px' }}>
          <Row gutter="1">
            <span style={{ marginRight: '15px' }}>支付状态:</span>
            <Radio.Group onChange={(e) => handleRadioChange(e, 'pay_status')} defaultValue={-1}>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>未付款</Radio>
              <Radio value={1}>已付</Radio>
            </Radio.Group>
          </Row>
          <Row gutter="1">
            <span style={{ marginRight: '15px' }}>是否发货:</span>
            <Radio.Group onChange={(e) => handleRadioChange(e, 'is_send')} defaultValue={-1}>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>未发货</Radio>
              <Radio value={1}>已发货</Radio>
            </Radio.Group>
          </Row>
          <Row gutter="1">
            <span style={{ marginRight: '15px' }}>客户类型:</span>
            <Radio.Group onChange={(e) => handleFapiaoTitleChange(e)} defaultValue="全部">
              <Radio value={'全部'}>全部</Radio>
              <Radio value={'个人'}>个人</Radio>
              <Radio value={'公司'}>公司</Radio>
            </Radio.Group>
          </Row>
          <Row gutter="1">
            <span style={{ lineHeight: '32px', marginRight: '15px' }}>公司名称:</span>
            <Input.Search
              allowClear
              placeholder="请输入公司名称"
              enterButton
              style={{ width: '280px' }}
              onSearch={handleSearch}
            />
          </Row>
        </Space>
      </Card>
      <Card className="content-card">
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="order_id"
          scroll={{ y: 'calc(100vh - 380px)' }}
          pagination={{
            defaultCurrent: paginationInfo.pagenum,
            defaultPageSize: paginationInfo.pagesize,
            total: totalPage,
            onChange: changePageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            hideOnSinglePage: true,
            size: 'small',
            pageSizeOptions: [5, 10, 20, 50],
            showTotal: function (total) {
              return <p>总数:{total}</p>;
            },
          }}
          bordered
          className="box-shadow1"
        />
      </Card>

      {editAddresVisible && (
        <EditAddress
          // data={editUserData}
          reloadData={fetchData}
          toggleVisible={() => setEditAddresVisible(!editAddresVisible)}
        />
      )}
      {editOrderVisible && (
        <EditOrder
          // data={editUserData}
          reloadData={fetchData}
          toggleVisible={() => setEditOrderVisible(!editOrderVisible)}
        />
      )}
      {logisticsVisible && (
        <Logistics
          // data={editUserData}
          reloadData={fetchData}
          toggleVisible={() => setLogisticsVisible(!logisticsVisible)}
        />
      )}
    </div>
  );
});
