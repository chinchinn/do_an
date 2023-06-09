import React, { Component } from 'react';
import { Row, Col, Button, Table, Tag } from 'antd';
import { StopOutlined, MinusCircleOutlined, SyncOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';




export default class Order extends Component {

    //
    CancelOrder(record) {
        this.props.onCancel(record.id);
    }


    handleViewDetail(record) {

        this.props.onHandleViewDetail(record);
    }
    render() {
        const { list } = this.props;

        //

        //
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                render: text => <span>{text}</span>,
            },
            {
                title: 'NGÀY ĐẶT',
                dataIndex: 'createDate',
                key: 'createDate',
                render: text => <span >{moment(text).format('DD/MM/YYYY')}</span>
            },

            {
                title: 'TRẠNG THÁI',
                key: 'status',
                dataIndex: 'status',
                render: status => (


                    <Tag style={{ width: 100 }} icon={status === 2 ? <SyncOutlined spin /> : status === 3 ? <CheckCircleOutlined /> : <MinusCircleOutlined></MinusCircleOutlined>}
                        color={status === 2 ? '#2db7f5' : status === 3 ? '#87d068' : '#f50'}>
                        {status === 2 ? 'Đang vận chuyển' : status === 3 ? 'received' : 'Chưa duyệt'}
                    </Tag>



                ),
            },
            {
                title: 'PHÍ SHIP',
                key: 'feeShip',
                dataIndex: 'feeShip',
                render: fee => (

                    <strong>{(fee).toLocaleString('vi-VN')} đ</strong>

                ),
            },

            {
                title: 'TỔNG TIỀN',
                dataIndex: 'total',
                key: 'total',
                render: total => <strong style={{ color: '#87d068' }}>{(total).toLocaleString('vi-VN')} đ</strong>
            },
            {
                title: 'Thao tác',
                render: (text, record, index) => (
                    <span>

                        <Button type="primary" icon={<EditOutlined />}
                            onClick={() => this.handleViewDetail(record)}>Chi tiết</Button>
                        <Button style={{ marginLeft: 4 }} disabled={record.status === 3 ? 'disabled' : null}
                            icon={<StopOutlined />} onClick={() => this.CancelOrder(record)} danger>Hủy đơn hàng</Button>
                    </span>
                ),
            }


        ];
        return (
            <div>
                <br></br>
                <Row>
                    <Col lg={{ span: 24 }}>
                        <Table columns={columns} dataSource={list}
                            pagination={{
                                position: ["bottomCenter", "bottomCenter"],
                                defaultPageSize: 5,
                                defaultCurrent: 1
                            }}
                        >

                        </Table>
                    </Col>

                </Row>
            </div>
        )
    }
}
