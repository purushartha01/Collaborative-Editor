import Icon from "@ant-design/icons";
import { DocumentDashboardIconSvg, LoginIconSvg } from "../assets/icons/iconProvider.jsx";
import { useState } from "react";
import { Link } from "react-router-dom"
import { Breadcrumb, Layout, Menu, theme } from "antd";

const getMenuItemContent = (label, key, icon, children) => {
    return {
        key,
        icon,
        children,
        label
    }
}


const menuItems = [
    getMenuItemContent(<Link to="/documents">My Documents</Link>, "/documents", <Icon component={DocumentDashboardIconSvg} />),
    getMenuItemContent(<Link to="/login">Login</Link>, "/login", <Icon component={LoginIconSvg} />),
];


const VerticalMenubar = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();


    return (
        <Layout style={{}}>
            <Layout.Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
            </Layout.Sider>
            <Layout>
                <Layout.Header style={{ padding: 0, background: colorBgContainer }} />
                <Layout.Content style={{ margin: '16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} />
                    <div style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG
                    }}>
                        {children}
                    </div>
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default VerticalMenubar