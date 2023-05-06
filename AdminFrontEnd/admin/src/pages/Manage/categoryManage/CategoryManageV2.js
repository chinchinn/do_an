/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import '../../../components/common/styleCommon/Content.css';
import BreadScrumb from '../../../components/breadScrumb/BreadScrumb';
import { Table, Button, Tag, Input, Row, Col, Spin, message, Popconfirm } from 'antd';
import axiosInstance from '../../../utils/axiosInstance';
import { EditOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import ModalCategory from '../../../components/category/modalCategory/ModalCategory';
import { useState } from 'react';
import { useEffect } from 'react';

const { Search } = Input;
const warn = "Bạn có chắc chắn muốn xóa danh mục này?";


function CategoryManageV2(props) {


    const [dataCategoryManage, setDataCategoryManage] = useState({
        data: [],
        item: {},
        visible: false,
        isLoading: true
    });


    function handleClickBtn(record) {
        setDataCategoryManage({
            ...dataCategoryManage, visible: true,
            item: { ...record }
        })
    }

    function handleOk(value) {
        setDataCategoryManage({
            ...dataCategoryManage,
            visible: value
        })
    }

    function handleCancel(value) {
        setDataCategoryManage({
            ...dataCategoryManage,
            visible: value
        })
    }

    async function getDataCategory() {
        await axiosInstance("ManageCategory", "GET")
            .then(res => {
                setDataCategoryManage({
                    ...dataCategoryManage,
                    data: [...res.data],
                    isLoading: false
                })
            }
            )
            .catch(err => console.log(err)
            )
    }

    useEffect(() => {
        getDataCategory();
    }, []);


    function handleChangeInput(e) {
        const { item } = dataCategoryManage;
        setDataCategoryManage({
            ...dataCategoryManage,
            item: { ...item, [e.target.name]: [e.target.value] }
        })
    }

    function handleSubmit(value) {
        if (value.id) {
            const { data } = dataCategoryManage;
            let tempData = [...data].filter(ele => ele.id !== value.id);
            setDataCategoryManage({ isLoading: true });
            axiosInstance('ManageCategory', 'PUT', value)
                .then(res => {
                    message.success(`${res.data.message}`, 2)
                    setDataCategoryManage({
                        ...dataCategoryManage,
                        data: [...tempData, value],
                        isLoading: false,
                        visible: false,
                    });
                }
                ).catch(err => {
                    message.warning("Thêm danh mục thất bại!", 2)
                    setDataCategoryManage({  ...dataCategoryManage,isLoading: false, visible: false, });
                })

        }
        else {
            setDataCategoryManage({ ...dataCategoryManage, isLoading: true });
            axiosInstance('ManageCategory', 'POST', value)
                .then(res => {
                    //console.log(res.data);
                    message.success("Thêm danh mục thành công!", 2);
                    const { data } = dataCategoryManage;
                    setDataCategoryManage(prevState => {
                        return {
                            ...prevState,
                            data: [...data, res.data],
                            isLoading: false,
                            visible: false
                        }
                    });
                })
        }

    }

    function confirmDelete(record) {
        const { data } = dataCategoryManage;
        let tempData = [...data].filter(ele => ele.id !== record.id);
        setDataCategoryManage({ ...dataCategoryManage, isLoading: true });

        axiosInstance(`ManageCategory/${record.id}`, 'DELETE')
            .then(res => {
                message.success(`${res.data.message}`, 2)
                setDataCategoryManage({
                    ...dataCategoryManage,
                    data: [...tempData],
                    isLoading: false,
                })
            })
            .catch(err => {
                message.warning("Xóa danh mục thất bại!", 2)
                setDataCategoryManage({  ...dataCategoryManage,isLoading: false });
            })
    }

    function handleSearch(value) {
        setDataCategoryManage({
            ...dataCategoryManage,
            isLoading: true,
        })
        if (value.trim() === '') {
            axiosInstance("ManageCategory", "GET")
                .then(res => {
                    setDataCategoryManage({
                        ...dataCategoryManage,
                        data: [...res.data],
                        isLoading: false
                    })
                }
                )
                .catch(err => console.log(err)
                )
        }
        else {
            axiosInstance(`ManageCategory/search/${value}`, 'GET')
                .then(res => {
                    console.log(res.data);

                    setDataCategoryManage({
                        ...dataCategoryManage,
                        data: [...res.data],
                        isLoading: false
                    })
                }
                )
                .catch(err => console.log(err)
                )
        }

    }
    console.log(dataCategoryManage);

    const columns = [
        {
            title: 'Tên chung',
            dataIndex: 'generalityName',
            width: '20%',
            key: 'generalityName',
            render: text => <span>{text}</span>,
        },
        {
            title: 'Tên chi tiết',
            dataIndex: 'name',
            width: '20%',
            key: 'name',
            render: text => <span>{text}</span>,
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '20%',
            key: 'status',
            render: status => (<span>{
                <Tag color="green">Hiển thị</Tag>
            }</span>)

        },
        {
            title: 'Số sản phẩm',
            dataIndex: 'products',
            width: '20%',
            key: 'products',
            render: products => <span>{products ? products.length : 0}</span>,
        },
        {
            title: (<Button icon={<ImportOutlined />} onClick={() => handleClickBtn()}
                style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }}>Add category</Button>),
            width: '20%',
            key: 'action',
            render: (text, record, index) => (

                <span>

                    <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 10, marginLeft: 10 }}
                        onClick={() => handleClickBtn(record)}>Update</Button>
                    <>
                        <Popconfirm placement="left" title={warn} onConfirm={() => confirmDelete(record)} okText="Yes" cancelText="No">
                            <Button icon={<DeleteOutlined />} type="danger">Delete</Button>
                        </Popconfirm>
                    </>
                </span>

            ),
        },
    ];
    return (
        <>
            <Header></Header>
            <div className="main_container">
                <Sidebar isActive="4"></Sidebar>
                <div className="content">
                    <BreadScrumb title="Quản lý danh mục"></BreadScrumb>

                    <Spin size="large" spinning={dataCategoryManage.isLoading} tip="Loading data">
                        <div style={{ margin: 10 }}>
                            <Row>
                                <Col span={12} offset={6}>
                                    <Search
                                        placeholder="tìm kiếm..."
                                        enterButton="Tìm kiếm"

                                        size="large"
                                        onSearch={value => handleSearch(value)}
                                    />
                                </Col>
                            </Row>
                        </div>

                        <Table style={{ margin: 10 }} width="100%" columns={columns} dataSource={dataCategoryManage.data} pagination={{
                            position: ["bottomCenter", "bottomCenter"],
                            defaultPageSize: 5,
                        }}>

                        </Table>
                        {
                            dataCategoryManage.visible ? <ModalCategory onChangeInput={handleChangeInput}
                                visible={dataCategoryManage.visible} data={dataCategoryManage.item}
                                onSubmitForm={handleSubmit}
                                onCancel={handleCancel}
                            ></ModalCategory> : null
                        }


                    </Spin>

                </div>
            </div>
        </>
    )


}


export default CategoryManageV2;