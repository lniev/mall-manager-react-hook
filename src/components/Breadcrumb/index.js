import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

/**
 *
 * @param {Array} props.items
 * items 为对象数组 [{path:'/',label:''}]
 */
export default function FCBreadcrumb(props) {
  const Items = props.items.map((el) => {
    return (
      <Breadcrumb.Item key={el.path}>
        <Link to={el.path}>{el.label}</Link>
      </Breadcrumb.Item>
    );
  });
  return (
    <Breadcrumb style={{ height: '40px', lineHeight: '40px' }}>
      <Breadcrumb.Item>
        <Link to="/home/welecome">
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      {Items}
    </Breadcrumb>
  );
}
