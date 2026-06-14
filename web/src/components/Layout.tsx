import React from 'react'
import { Layout as AntLayout, Menu, theme } from 'antd'
import {
  RadarChartOutlined,
  BarChartOutlined,
  NodeIndexOutlined,
  MessageOutlined,
  FileTextOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const menuItems = [
    {
      key: '/coverage',
      icon: <RadarChartOutlined />,
      label: '覆盖预测',
    },
    {
      key: '/capacity',
      icon: <BarChartOutlined />,
      label: '容量分析',
    },
    {
      key: '/optimization',
      icon: <NodeIndexOutlined />,
      label: '参数优化',
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: '模型对话',
    },
    {
      key: '/logs',
      icon: <FileTextOutlined />,
      label: '系统日志',
    },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
        <GlobalOutlined style={{ color: 'white', fontSize: 24, marginRight: 12 }} />
        <h1 style={{ color: 'white', margin: 0, fontSize: 18 }}>无线网络仿真平台</h1>
      </Header>
      <AntLayout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <AntLayout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: 8,
            }}
          >
            {children}
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  )
}
