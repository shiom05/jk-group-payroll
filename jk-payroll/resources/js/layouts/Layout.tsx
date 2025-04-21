import React, { useState } from "react";
import { type SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout as AntDLayout, Menu, theme } from 'antd';

const { Header, Sider, Content } = AntDLayout;

const Layout = ({ children }: { children: React.ReactNode }) => {
       const { auth: { user } } = usePage<SharedData>().props;

       const directToDashboard = ()=>{
        router.get('/dashboard');
       }

       const [collapsed, setCollapsed] = useState(false);
       const {
         token: { colorBgContainer, borderRadiusLG },
       } = theme.useToken();

    return (
      <AntDLayout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="text-center text-xl font-bold text-white">JK SECURITY</div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={({ key }) => {
            switch (key) {
              case '1':
                router.get('/dashboard');
                break;
              case '2':
                router.get('/some-other-page'); // replace with actual route
                break;
              case '3':
                router.get('/another-page'); // replace with actual route
                break;
              default:
                break;
            }
          }}
          items={[
            {
              key: '1',
              icon: <UserOutlined  />,
              label: 'Dashboard',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
    
      {/* This Layout should be shifted to the right of the fixed sider */}
      <AntDLayout
        style={{
          marginLeft: collapsed ? 80 : 200, // Adjust based on sider width when collapsed
          minHeight: '100vh',
        }}
      >
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex">
          <nav className="flex w-full items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-300 text-white">
            {user && (
              <button className="!cursor-pointer rounded bg-red-600 px-4 py-2 transition hover:bg-red-700">
                Logout
              </button>
            )}
          </nav>
        </Header>
    
        <Content
          style={{
            margin: '0px',
            // padding: 24,
            overflow: 'auto',
            height: 'calc(100vh - 64px)', // Adjust for header height
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </AntDLayout>
    </AntDLayout>
    
    );
  };
  
  export default Layout;
  