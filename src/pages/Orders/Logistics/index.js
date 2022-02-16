import React, { memo, useState, useEffect } from 'react';
import { Steps, Divider, Input, Cascader, message, Modal } from 'antd';
import { Kuaidi } from 'services/api';
// ！！！ 编辑地址的这个功能api文档不全，这里只模拟了该功能
export default memo(function FCLogistics(props) {
  /**
   * 页面状态和方法
   */
  const [logisticsData, setLogisticsData] = useState([]);
  async function fetchData(params) {
    // !!! 这里的快递要从父组件中获取，这里使用模拟数据
    // !!! 然而接口文档的模拟数据也不能用 将文档中的实例数据copy过来模拟
    // const { meta, data } = await Kuaidi('get', `/1106975712662`);
    // if (meta.status !== 200) return message.error(meta.msg);
    setLogisticsData([
      {
        time: '2018-05-10 09:39:00',
        ftime: '2018-05-10 09:39:00',
        context: '已签收,感谢使用顺丰,期待再次为您服务',
        location: '',
      },
      {
        time: '2018-05-10 08:23:00',
        ftime: '2018-05-10 08:23:00',
        context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
        location: '',
      },
      {
        time: '2018-05-10 07:32:00',
        ftime: '2018-05-10 07:32:00',
        context: '快件到达 [北京海淀育新小区营业点]',
        location: '',
      },
      {
        time: '2018-05-10 02:03:00',
        ftime: '2018-05-10 02:03:00',
        context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
        location: '',
      },
      {
        time: '2018-05-09 23:05:00',
        ftime: '2018-05-09 23:05:00',
        context: '快件到达 [北京顺义集散中心]',
        location: '',
      },
      {
        time: '2018-05-09 21:21:00',
        ftime: '2018-05-09 21:21:00',
        context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
        location: '',
      },
      {
        time: '2018-05-09 13:07:00',
        ftime: '2018-05-09 13:07:00',
        context: '顺丰速运 已收取快件',
        location: '',
      },
      {
        time: '2018-05-09 12:25:03',
        ftime: '2018-05-09 12:25:03',
        context: '卖家发货',
        location: '',
      },
      {
        time: '2018-05-09 12:22:24',
        ftime: '2018-05-09 12:22:24',
        context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
        location: '',
      },
      {
        time: '2018-05-08 21:36:04',
        ftime: '2018-05-08 21:36:04',
        context: '商品已经下单',
        location: '',
      },
    ]);
  }

  /**
   * 副作用
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 页面组件相关配置
   */

  const { Step } = Steps;
  return (
    <Modal
      visible
      title="物流信息"
      centered="true"
      width="50vw"
      footer={null}
      onCancel={props.toggleVisible}
    >
      <Steps progressDot current={logisticsData.length - 1} direction="vertical">
        {logisticsData.reverse().map((el) => (
          <Step title={el.time} description={el.context} key={el.time} />
        ))}
      </Steps>
    </Modal>
  );
});
