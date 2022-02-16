import React, { PureComponent } from 'react';
import { Layout, Menu, message, Button } from 'antd';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './App.less';
import { Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { getMenus, Rights } from 'services/api';
import routes from 'router';

// 路由内容
const routerContent = renderRoutes(routes);
// 解构组件
const { Header, Content, Sider } = Layout;

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menusList: [],
    };
  }
  // 切换侧边栏隐藏
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  /**
   * 退出登录
   */
  handleLogout = () => {
    localStorage.removeItem('token');
    this.props.history.push('Login');
  };

  async componentDidMount() {
    // 获取页面的
    const { data, meta } = await getMenus();
    if (meta.status !== 200) return message.error(meta.msg);
    this.setState({
      menusList: data,
    });

    Rights('get', '/tree').then(res => {
      if (res.meta.status !== 200) return message.error(meta.msg);


    })
      ;
  }

  render() {
    // 菜单栏
    const Menus = this.state.menusList.map((el, idx) => {
      const Items = el.children.map((els) => {
        return (
          <Menu.Item key={'c' + els.authName} icon={<UserOutlined />}>
            <Link to={'/home/' + els.path}>{els.authName}</Link>
          </Menu.Item>
        );
      });
      return (
        <Menu.SubMenu key={idx} icon={<UserOutlined />} title={el.authName}>
          {Items}
        </Menu.SubMenu>
      );
    });
    // const BreadcrumbItems = routes.map((el) => {
    //   return <Breadcrumb.Item></Breadcrumb.Item>;
    // });

    return (
      <Layout id="app">
        <Sider breakpoint="md"
          // collapsedWidth="0"
          // collapsible
          theme='light'
          collapsed={this.state.collapsed}
          className="slider">
          {/* logo */}
          <img src='https://gw.alipayobjects.com/zos/basement_prod/5b153736-dfe3-4a73-9454-68607c8103e4.svg' className="logo" alt="logo"></img>
          {/* 侧边菜单 */}
          <Menu theme='light' mode="inline" defaultSelectedKeys={['1']} >{Menus}</Menu>
        </Sider>
        <Layout className="site-layout" >
          {/* 头部 */}
          <Header className="site-layout-background header">
            {/* 头部左边功能区 */}
            <div className="header-left">
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </div>
            {/* 头部右边功能区 */}
            <div className="header-right">
              <Button type="primary" shape="round" onClick={this.handleLogout}>
                Logout
              </Button>
            </div>
          </Header>
          {/* 内容区 */}
          <Content className="site-layout-background content">{routerContent}</Content>
        </Layout>
      </Layout>
    );
  }
}
