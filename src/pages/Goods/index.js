import './styles.less';
import React, { memo, useState, useEffect } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { Card, Input, Col, Row, Table, Switch, Space, message, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Goods } from 'services/api';
import moment from 'moment'
import AddUser from './AddGoods';
import EidtUser from './EditGoods';
import AssignRoles from './AssignRoles';


import { renderRoutes } from 'react-router-config';


export default memo(function FCGoods(props) {
  /**
   * 表格数据更改相关处理
   */

  const [tableData, setTableData] = useState([]); // 表格数据
  const [paginationInfo, setPaginationInfo] = useState({
    pagenum: 1,
    pagesize: 5,
  }); // 分页信息
  const [totalpage, setTotalpage] = useState(0); //数据汇总

  // 拉取商品的数据
  async function fetchData(params) {
    const { data, meta } = await Goods('get', params || paginationInfo);
    if (meta.status !== 200) {
      message.error(meta.msg);
      return false;
    }
    setTableData(data.goods);
    setTotalpage(data.total);
    return true;
  }

  // 处理搜索
  async function handleSearch(val) {
    const { data, meta } = await Goods('get', {
      query: val,
      pagenum: paginationInfo.pagenum,
      pagesize: paginationInfo.pagesize,
    });
    if (meta.status !== 200) return message.error(meta.msg);
    setTableData(data.goods);
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
        Goods('del', '/' + record.goods_id)
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
      title: '商品名称',
      dataIndex: 'goods_name',
      key: 'goods_name',
    },
    {
      title: '商品价格',
      dataIndex: 'goods_price',
      key: 'goods_price',
    },
    {
      title: '商品重量',
      dataIndex: 'goods_weight',
      key: 'goods_weight',
    },
    {
      title: '商品数量',
      dataIndex: 'goods_number',
      key: 'goods_number',
    },
    {
      title: '创建时间',
      dataIndex: 'add_time',
      key: 'add_time',
      render: (add_time) => moment(add_time * 1000).format('YYYY-MM-DD h:mm:ss')
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
        </Space>
      ),
    },
  ];

  /**
   * 副作用
   */

  useEffect(() => {
    console.log(props);
    if (fetchData()) message.success('获取用户列表成功');
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ path: '/home/goods', label: '商品列表' }]} />
      <Card className="content-card">
        <Space size="middle" style={{ marginBottom: '15px' }}>
          <Input.Search
            allowClear
            placeholder="请输入"
            enterButton
            style={{ width: '280px' }}
            onSearch={handleSearch}
          />
          <Button type="primary" onClick={() => props.history.push('/home/goods/addGoods')}>
            添加商品
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
          rowKey="goods_id"
          bordered
          className="box-shadow1"
          scroll={{ y: 'calc(100vh - 335px )' }}

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

      {renderRoutes(props.route.routes)}

    </div>
  );
});
