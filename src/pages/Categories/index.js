import './styles.less';
import React, { memo, useState, useEffect } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { Card, Input, Tag, Table, Space, message, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Categories } from 'services/api';
// import AddUser from './AddGoods';
// import EidtUser from './EditGoods';
// import AssignRoles from './AssignRoles';

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
    const { data, meta } = await Categories('get', params || paginationInfo);
    if (meta.status !== 200) {
      message.error(meta.msg);
      return false;
    }
    setTableData(data.result);
    setTotalpage(data.total);
    return true;
  }

  // 处理搜索
  async function handleSearch(val) {
    const { data, meta } = await Categories('get', {
      query: val,
      pagenum: paginationInfo.pagenum,
      pagesize: paginationInfo.pagesize,
    });
    if (meta.status !== 200) return message.error(meta.msg);
    setTableData(data.goods);
  }

  // 处理用户状态改变
  async function handleSwitch(text, val, record, index) {
    //请求更改
    const { meta } = await Categories('put', `/${record.id}/state/${val}`);
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
   * 删除用户
   */

  async function handleDelete(record) {
    Modal.confirm({
      title: '确认删除此分类?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      centered: true,
      onOk() {
        Categories('del', '/' + record.id)
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
      title: '分类名称',
      dataIndex: 'cat_name',
      key: 'cat_name',
    },
    {
      title: '分类当前层级',
      dataIndex: 'cat_level',
      key: 'cat_level',
      render: (cat_level, record) => {
        if (cat_level == 0) return <Tag color="green" className="levelTag">一级</Tag>
        if (cat_level == 1) return <Tag color="blue" className="levelTag">二级</Tag>
        if (cat_level == 2) return <Tag color="orange" className="levelTag">三级</Tag>
      }


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
    console.log(123);
    if (fetchData()) message.success('获取用户列表成功');
  }, []);

  return (
    <div className='Categories'>
      <Breadcrumb items={[{ path: '/home/goods', label: '商品分类' }]} />
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
            添加分类
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
          scroll={{ y: 'calc(100vh - 295px )' }}
          rowKey="cat_id"
          bordered
          className="box-shadow1"
        />
      </Card>
      {/* {addUserVisible && (
        <AddUser reloadData={fetchData} toggleVisible={() => setAddUserVisible(!addUserVisible)} />
      )}
      {editUserVisible && (
        <EidtUser
          data={editUserData}
          reloadData={fetchData}
          toggleVisible={() => setEditUserVisible(!editUserVisible)}
        />
      )} */}

    </div>
  );
});
