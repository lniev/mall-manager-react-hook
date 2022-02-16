import React, { memo, useEffect, useState } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { Card, message } from 'antd';
import { Reports } from 'services/api';
import { Area } from '@ant-design/charts';

export default memo(function FCReport() {
  /**
   * 页面状态和相关方法
   */

  const [chartData, setChartData] = useState([]);

  async function fetchChartData() {
    const { meta, data } = await Reports('get');
    if (meta.status !== 200) message.error(meta.msg);
    message.success(meta.msg);
    let restedData = [];
    data.series.forEach((el) => {
      restedData = restedData.concat(
        el.data.map((cel, idx) => {
          let _obj = {};
          _obj.name = el.name;
          _obj.value = cel;
          _obj.date = data.xAxis[0]?.data?.[idx];
          return _obj;
        })
      );
    });
    setChartData(restedData);
  }

  /**
   * 页面组件的相关配置
   */

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
  };

  /**
   * 副作用
   */
  useEffect(() => {
    fetchChartData();
  }, []);
  return (
    <div>
      <Breadcrumb items={[{ path: '/home/rights', label: '报表统计' }]}></Breadcrumb>
      <Card>
        <Area {...config} />
      </Card>
    </div>
  );
});
