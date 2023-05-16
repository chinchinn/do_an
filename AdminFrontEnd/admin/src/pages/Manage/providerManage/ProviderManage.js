import React, { Component } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import '../../../components/common/styleCommon/Content.css';
import BreadScrumb from '../../../components/breadScrumb/BreadScrumb';
//
import { Table, Button, Tag, Input, Row, Col, Spin, message, Popconfirm } from 'antd';
import axiosInstance from '../../../utils/axiosInstance';
import { EditOutlined, DeleteOutlined, ImportOutlined, RotateLeftOutlined } from '@ant-design/icons';
import ModalProvider from '../../../components/provider/modalProvider/ModalProvider';

const { Search } = Input;
const warn = "Bạn có chắc chắn muốn xóa nhà cung ứng này?";

const updateStatus = "Bạn có chắc chắn muốn hiển thị nhà cung ứng này?"

export default class ProviderManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            item: {},
            visible: false,
            isLoading: true
        }
    }

    //lifecycle mounted
    componentDidMount() {
        axiosInstance("ManageProvider", "GET")
            .then(res => {
                this.setState({
                    data: [...res.data],
                    isLoading: false
                })
            }
            )
            .catch(err => console.log(err)
            )
    }

    //xử khi gọi add, update , enable modal
    handleClickBtn(record = null) {

        this.setState({
            visible: true,
            item: { ...record }
        })
    }

    //xử lý tắt modal
    handleCancel(value) {
        this.setState({
            visible: value
        })
    }
    //xử lý change input của modal
    handleChangeInput(e) {
        const { item } = this.state;
        this.setState({
            item: { ...item, [e.target.name]: [e.target.value] }
        })
    }
    // xử lý add, update
    handleSubmit(value) {
        if (value.id) {
            const { data } = this.state;
            let tempdata = [...data].filter(ele => ele.id !== value.id);
            this.setState({ isLoading: true });
            axiosInstance('ManageProvider', 'PUT', value)
                .then(res => {

                    if (res?.code === 99) {
                        message.error(res.message, 2)
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                isLoading: false,
                                visible: false
                            }
                        });
                    }
                    else {
                        message.success(`${res.data.message}`, 2)
                        this.setState({
                            data: [...tempdata, value],
                            isLoading: false,
                            visible: false,
                        });
                    }

                }
                ).catch(err => {
                    message.warning("Cập nhật nhà cung cấp thất bại!", 2)
                    this.setState({ isLoading: false, visible: false, });
                })
        }
        else {
            this.setState({ isLoading: true });
            axiosInstance('ManageProvider', 'POST', value)
                .then(res => {
                    debugger;
                    if (res?.data?.code === 99) {
                        message.error(res?.data?.message, 2)
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                isLoading: false,
                                visible: false
                            }
                        });
                    }
                    else {
                        message.success("Thêm nhà cung cấp thành công!", 2)
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                data: [...prevState.data, res.data],
                                isLoading: false,
                                visible: false
                            }
                        });
                    }
                    //console.log(res.data);
                })
        }

    }

    //api xóa
    confirmDelete(record) {
        const { data } = this.state;
        let tempdata = [...data];
        this.setState({ isLoading: true });


        if (record.status === 0) {
            axiosInstance(`ManageProvider/${record.id}`, 'DELETE')
                .then(res => {
                    message.success(`${res.data.message}`, 2)
                    this.setState({
                        data: [...tempdata].map(x => {

                            if (x.id === record.id) {
                                return { ...x, status: 1 }
                            }
                            else { return x }
                        }),
                        isLoading: false,
                    })
                })
                .catch(err => {
                    message.warning("Xóa nhà cung cấp thất bại!", 2)
                    this.setState({ isLoading: false });
                })
        }
        else {
            axiosInstance(`ManageProvider/ChangeStatus/${record.id}`, 'POST')
                .then(res => {
                    message.success(`Cập nhật thành công`, 2)
                    this.setState({
                        data: [...tempdata].map(x => {

                            if (x.id === record.id) {
                                return { ...x, status: 0 }
                            }
                            else { return x }
                        }),
                        isLoading: false,
                    })
                })
                .catch(err => {
                    message.warning("Cập nhật nhà cung cấp thất bại!", 2)
                    this.setState({ isLoading: false });
                })
        }

    }

    //api tìm kiếm
    handleSearch(value) {
        this.setState({
            isLoading: true,
        })
        if (value.trim() === '') {
            axiosInstance("ManageProvider", "GET")
                .then(res => {
                    this.setState({
                        data: [...res.data],
                        isLoading: false
                    })
                }
                )
                .catch(err => console.log(err)
                )
        }
        else {
            axiosInstance(`ManageProvider/search/${value}`, 'GET')
                .then(res => {
                    console.log(res.data);

                    this.setState({
                        data: [...res.data],
                        isLoading: false
                    })
                }
                )
                .catch(err => console.log(err)
                )
        }

    }

    render() {
        const { data, item, visible, isLoading } = this.state;
        // colums
        const columns = [
            {
                title: 'Mã nhà cung ứng',
                dataIndex: 'code',
                key: 'code',
                render: text => <span>{text}</span>,
            },
            {
                title: 'Tên nhà cung ứng',
                dataIndex: 'name',
                key: 'name',
                render: text => <span>{text}</span>,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                render: text => <span>{text}</span>,
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phoneNumber',
                key: 'phoneNumber',
                render: text => <span>{text}</span>,
            },
            {
                title: 'Địa chỉ',
                dataIndex: 'address',
                key: 'address',
                render: text => <span>{text}</span>,
            },

            {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                render: text => <span><Button style={text === 0 ? { background: '#4abd2b ', color: '#ffffff' } : { background: '#c10417', color: '#ffffff' }}>{text === 1 ? "Không hoạt động" : "Hoạt động"}</Button></span>
            },

            {
                title: (<Button icon={<ImportOutlined />} onClick={() => this.handleClickBtn()}
                    style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }}>Thêm nhà cung cấp</Button>),
                width: '30%',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                        <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 10, marginLeft: 10 }} disabled={record.status === 0 ? false : true}
                            onClick={() => this.handleClickBtn(record)}>Cập nhật</Button>
                        <Popconfirm placement="left" title={record.status === 0 ? warn : updateStatus} onConfirm={() => this.confirmDelete(record)} okText="Yes" cancelText="No">
                            {record.status === 0 ? <Button icon={<DeleteOutlined />} type="danger">Xóa</Button>
                                : <Button icon={<RotateLeftOutlined />}
                                    style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }}
                                >Hiển thị</Button>}

                        </Popconfirm>
                    </span>

                ),
            },
        ];

        //map data
        const datas = data.map(ele => {
            return { key: ele.id, ...ele }
        })

        return (
            <>
                <Header></Header>
                <div className="main_container">
                    <Sidebar isActive="5"></Sidebar>
                    <div className="content">
                        <BreadScrumb title="Quản lý nguồn cung"></BreadScrumb>
                        {
                            isLoading ? <Spin size="large" tip="Loading data">
                                <div style={{ margin: 10 }}>
                                    <Row>
                                        <Col span={12} offset={6}>
                                            <Search
                                                placeholder="tìm kiếm..."
                                                enterButton="Tìm kiếm"

                                                size="large"
                                                onSearch={value => console.log(value)}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <Table style={{ margin: 10 }} width="100%" columns={columns} dataSource={datas} pagination={{
                                    position: ["bottomCenter", "bottomCenter"],
                                    defaultPageSize: 5,
                                }}>

                                </Table>



                            </Spin> : <>
                                <div style={{ margin: 10 }}>
                                    <Row>
                                        <Col span={12} offset={6}>
                                            <Search
                                                placeholder="tìm kiếm..."
                                                enterButton="Tìm kiếm"

                                                size="large"
                                                onSearch={value => this.handleSearch(value)}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <Table style={{ margin: 10 }} width="100%" columns={columns} dataSource={datas} pagination={{
                                    position: ["bottomCenter", "bottomCenter"],
                                    defaultPageSize: 5,
                                }}>

                                </Table>


                                {
                                    visible ? <ModalProvider visible={visible} data={item} onSubmitForm={(value) => this.handleSubmit(value)}
                                        onCancel={() => this.handleCancel()} onChangeInput={(e) =>
                                            this.handleChangeInput(e)}></ModalProvider> : ''
                                }
                            </>
                        }
                    </div>
                </div>
            </>
        )
    }
}