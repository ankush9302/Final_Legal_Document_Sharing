import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button } from 'antd';
import {
	HomeOutlined,
	UploadOutlined,
	TeamOutlined,
	SettingOutlined,
	UserOutlined,
	LogoutOutlined,
	EnvironmentOutlined,
	UserSwitchOutlined,
	BarChartOutlined,
	CreditCardOutlined,
	FileExcelOutlined,
	FilePdfOutlined,
	EditOutlined,

} from '@ant-design/icons';
import '../styles/DefaultLayout.css';
import { logout } from '../redux/userSlice';
import BatchSelector from './BatchSelector';

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const userRole = useSelector((state) => state.user.userRole);
	const userName = useSelector((state) => state.user.name);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const adminMenu = [
		{ key: '/dashboard', icon: <HomeOutlined />, label: 'Home' },
		{ key: '/share-documents', icon: <UploadOutlined />, label: 'Share Documents' },
		{ key: '/subadmin-management', icon: <UserSwitchOutlined />, label: 'Manage SubAdmin' },
		{ key: '/clients', icon: <TeamOutlined />, label: 'Manage Clients' },
			{ key: '/report', icon: <BarChartOutlined />, label: 'View Reports' },
		{ key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
		{ key: '/profile', icon: <UserOutlined />, label: 'Profile' },
		{ key: '/city-management', icon: <EnvironmentOutlined />, label: 'Manage Cities' },
		{ key: '/subscription', icon: <CreditCardOutlined />, label: 'Subscription' },
		{ key: '/excel-upload', icon: <FileExcelOutlined />, label: 'Excel Upload' },
		{ key: '/pdf-processing', icon: <FilePdfOutlined />, label: 'PDF Processing' },
		{ key: '/message-editor', icon: <EditOutlined />, label: 'Message Editor' },
	];

	const subadminMenu = [
		{ key: '/dashboard', icon: <HomeOutlined />, label: 'Home' },
		{ key: '/share-documents', icon: <UploadOutlined />, label: 'Upload & Share' },
			{ key: '/profile', icon: <UserOutlined />, label: 'Profile' },
	];

	const menuItems = userRole === 'subadmin' ? subadminMenu : adminMenu;

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem('token');
		navigate('/login');
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
				<div className="logo">LegalDocSharing</div>
				<Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
					{menuItems.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							<Link to={item.key}>{item.label}</Link>
						</Menu.Item>
					))}
				</Menu>
			</Sider>
			<Layout>
				<Header style={{ background: '#fff', padding: 0 }}>
						<div style={{marginLeft: '16px'}}>
							<BatchSelector/>
						</div>
					<div style={{ float: 'right', marginRight: '16px' }}>
						<span style={{ marginRight: '8px' }}>{userName}</span>
						<Button onClick={handleLogout} icon={<LogoutOutlined />}>
							Logout
						</Button>
					</div>
				</Header>
				<Content style={{ margin: '16px' }}>
					<div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
						{children}
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default DefaultLayout;
