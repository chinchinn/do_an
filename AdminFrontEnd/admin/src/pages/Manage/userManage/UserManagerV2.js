import React, { Component, useState, useEffect, useRef } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import '../../../components/common/styleCommon/Content.css';
import BreadScrumb from '../../../components/breadScrumb/BreadScrumb';
import { Row, Col, Table, Popconfirm, Button, Avatar, Tag, message, Spin, Input, Select, Modal, Form } from 'antd';
import axiosInstance from '../../../utils/axiosInstance';
import queryString from 'querystring';
import moment from 'moment';

import { RotateLeftOutlined, UserOutlined, DeleteOutlined, SearchOutlined, SyncOutlined, ImportOutlined } from '@ant-design/icons';
import './userManagerV2.css';


const OK = "Khôi phục trạng thái Hiển thị cho User này!";
const Cancel = "Xác nhận Xóa User này!";

function UserManagerV2() {

    const [userManager, setUserManager] = useState({
        userList: [],
        isLoading: false,
        keyWord: null,
        status: null

    });

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const isMounted = useRef(false);

    const [showModelAdd, setShowModelAdd] = useState(false);

    const [role, setRole] = useState([]);

    const [roleSelected, setRoleSelected] = useState();
    const [form] = Form.useForm();




    async function callApi() {
        let list = await axiosInstance('ManageUser/GetUserDisplayList', 'GET')
            .then(res => res.data);
        let format = list.map(e => {
            return { ...e, key: e.id }
        })
        setUserManager({
            ...userManager,
            userList: format,
            isLoading: false,
        })
    }

    async function getUserRoles() {

        let list = await axiosInstance('User/GetRoles', 'GET')
            .then(res => res.data);
        setRole(list);

    }

    async function confirm(record) {
        setUserManager({
            ...userManager,
            isLoading: true,
        })
        let check = await axiosInstance('ManageUser/DisplayUser', 'POST', { id: record.id, status: 0 })
            .then(res => res.data);
        if (check) {
            message.success('Đổi trạng thái Hiển thị cho User này Thành công!', 4)
            await callApi();
        }
        else {
            message.warning('Đổi trạng thái Hiển thị thất bại!', 4)
            await callApi();
        }
    }

    async function confirmCancel(record) {
        setUserManager({
            ...userManager,
            isLoading: true,
        })
        let check = await axiosInstance('ManageUser/DeleteUser', 'POST', { id: record.id, status: 1 })
            .then(res => res.data);
        if (check) {
            message.success('Xóa User này Thành công!', 4)
            await callApi();
        }
        else {
            message.warning('Xóa User thất bại!', 4)
            await callApi();
        }
    }

    //
    async function handleSearch() {
        setUserManager({
            ...userManager,
            isLoading: true,
        })
        const { keyWord, status } = userManager;
        let list = await axiosInstance('ManageUser/SearchUser', 'POST', { keyWord, status })
            .then(res => res.data);
        let format = list.map(e => {
            return { ...e, key: e.id }
        })
        setUserManager({
            ...userManager,
            userList: format,
            isLoading: false,
        })
    }
    //
    async function handleReset() {
        await callApi();
    }

    async function addUser() {

        var validate = Object.values(form.getFieldsValue()).every(x => x != undefined);
        if (validate) {
            setUserManager({ ...userManager, isLoading: true })
            var dataForm = form.getFieldsValue();

            dataForm = { ...dataForm, RoleId: roleSelected }

            let check = await axiosInstance('ManageUser/CreateUser', 'POST', dataForm)
                .then(res => res.data);

            if (check) {
                await callApi();
                setShowModelAdd(false);
                message.success("Tạo user thành công và vui lòng kiểm tra email xác thực tài khoản.")
            }
            else {
                message.error("Tạo user thất bại.")
            }
            setUserManager({ ...userManager, isLoading: false })
        }




    }
    //
    function handleChangeInput(e) {
        setUserManager({
            ...userManager,
            keyWord: e.target.value,
        })
    }
    //
    function handleChangeStatus(e) {
        setUserManager({
            ...userManager,
            status: e,
        })
    }
    useEffect(() => {
        isMounted.current = true;
        setUserManager({
            ...userManager,
            isLoading: true,
        })

        Promise.all([
            axiosInstance('User/GetRoles', 'GET'),
            axiosInstance('ManageUser/GetUserDisplayList', 'GET'),

        ]).then(res => {
            let format = res[1].data.map(e => {
                return { ...e, key: e.id }
            })
            setRole(res[0].data);
            setUserManager({
                ...userManager,
                userList: format,
                isLoading: false,
            })
        })

        return () => isMounted.current = false;
    }, [])


    const rowSelection = {
        type: 'checkbox',
        onSelectAll(selected, selectedRows, changeRows) {
            // Handle select all checkbox change here
            if (selected) {
                debugger;
                setSelectedRowKeys(userManager.userList.map((row) => row.key));
            } else {
                setSelectedRowKeys([]);
            }
        },
        onChange(selectedRowKeys, selectedRows) {
            debugger;
            // Handle individual checkbox change here
            setSelectedRowKeys(selectedRowKeys);
        },
        selectedRowKeys,
    };


    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onChange = (value) => {

        setRoleSelected(value);
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    }


    const popupModelAdd = () => {

        return (<Modal
            title="Thêm tài khoản"
            visible={showModelAdd}
            onOk={addUser}
            confirmLoading={userManager.isLoading}
            onCancel={() => { setShowModelAdd(false) }}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{ username: "", password: "", email: "", role: "" }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="Email"

                    rules={[
                        {
                            type: 'email',
                            message: 'Nhập email không hợp lệ!',
                        },
                        {
                            required: true,
                            message: 'Xin vui lòng nhập email',
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Username"
                    name="UserName"

                    rules={[
                        {

                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Quyền"
                    name="RoleName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your role!',
                        },
                    ]}
                    hasFeedback
                >
                    <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={role?.map(x => { return { value: x.id, label: x.name } })
                        }
                    />
                </Form.Item>


                {/* <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button onclick={() => {
                        setShowModelAdd(false);
                    }} type="primary" htmlType="button">
                        Huy
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form.Item> */}
            </Form>
        </Modal>)

    }

    const columns = [
        {
            title: 'KHÁCH HÀNG',
            key: 'displayname',
            dataIndex: 'displayname',

            render: text => <span>{text}</span>,
        },

        {
            title: 'AVATAR',
            key: 'avatar',
            dataIndex: 'avatar',

            render: text => <Avatar shape="square" src={text} size={64} icon={<UserOutlined />} />
        },
        {
            title: 'ROLE',
            key: 'roleName',
            dataIndex: 'roleName',

            render: text => {
                return text === "User" ? <span style={{ color: '#52c41a' }}>{text}</span> :
                    <span style={{ color: '#1890ff' }}>{text}</span>
            }
        },
        {
            title: 'SĐT',
            key: 'phone',
            dataIndex: 'phone',

            render: text => <span >{text}</span>
        },
        {
            title: 'TRẠNG THÁI',
            key: 'status',
            dataIndex: 'status',

            render: text => text === 0 ? <Tag color="#87d068">Active</Tag> : <Tag color="error">InActive</Tag>
        },
        {
            title: 'NGÀY TẠO',

            key: 'birthDay',
            dataIndex: 'birthDay',
            render: text => <span >{moment(text).format('DD/MM/YYYY')}</span>
        },

        {
            title: 'TÙY CHỌN',
            key: 'action',
            align: 'center',

            render: (text, record, index) => (
                <span>
                    {
                        text.status === 0 ?
                            <Popconfirm placement="left" title={Cancel} onConfirm={() => confirmCancel(record)} okText="Yes"
                                cancelText="No">
                                <Button icon={<DeleteOutlined />}
                                    type="danger">Xóa</Button>
                            </Popconfirm>
                            :
                            <Popconfirm placement="left" title={OK}
                                onConfirm={() => confirm(record)} okText="Yes"
                                cancelText="No">
                                <Button icon={<RotateLeftOutlined />}
                                    style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }}
                                >Hiển thị</Button>
                            </Popconfirm>
                    }

                </span>
            ),
        },
    ];

    return (
        <>
            <Header></Header>
            <div className="main_container">

                <Sidebar isActive="7"></Sidebar>
                <div className="content">
                    <BreadScrumb title="Quản lý user"></BreadScrumb>
                    <Spin spinning={userManager.isLoading} tip="LOADING" size="large">
                        <br />
                        <Row>

                            <Col span={6} offset={2}>
                                <Input
                                    placeholder="Key word"
                                    value={userManager.keyWord}
                                    allowClear={true}
                                    onChange={handleChangeInput}
                                ></Input>
                            </Col>
                            <Col span={7} offset={1}>
                                <Select placeholder="Status" style={{ width: 250 }}
                                    onChange={(e) => handleChangeStatus(e)}
                                >
                                    <Select.Option value={0}>Hoạt động</Select.Option>
                                    <Select.Option value={1}>Không hoạt động</Select.Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Button style={{ borderColor: '#0050b3', color: '#0050b3', marginRight: '10px' }}
                                    icon={<SearchOutlined />}
                                    onClick={handleSearch}
                                >
                                    Tìm kiếm
                                </Button>
                                <Button onClick={handleReset} style={{ marginRight: '10px' }} icon={<SyncOutlined />}>Cập nhật tìm kiếm</Button>

                                <Button onClick={() => setShowModelAdd(true)} style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }} icon={<ImportOutlined />}>Thêm tài khoản</Button>
                            </Col>

                        </Row>
                        <br />
                        {popupModelAdd()}
                        <Row>
                            <Col span={24}>
                                <Table columns={columns}
                                    dataSource={userManager.userList}
                                    pagination={{
                                        position: ["bottomCenter", "bottomCenter"],
                                        defaultPageSize: 4,
                                        defaultCurrent: 1
                                    }}
                                // rowSelection={rowSelection}

                                >

                                </Table>
                            </Col>
                        </Row>
                    </Spin>
                </div>
            </div>
        </>
    )

}
export default UserManagerV2;

