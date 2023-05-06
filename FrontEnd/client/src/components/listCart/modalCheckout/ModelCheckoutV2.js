/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component, Fragment, useState } from 'react';
import { Modal, Row, Col, Form, Input, Select, Button, Spin, Timeline } from 'antd';
import { ShoppingOutlined, CarOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { StripeProvider, Elements } from 'react-stripe-elements';
import FormStripe from '../formStripe/FormStripe';
import * as ParsePrice from '../../../helper/parsePriceForSale';
import axiosInstance from '../../../utils/axiosInstance';
import { connect } from 'react-redux';
import { useEffect } from 'react';


const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 18
    },
};

function ModelCheckoutV2(props) {

    const [stateCheckout, setStateCheckout] = useState({
        onlinePayment: false,
        user: {},
        isMounted: false,
        feeShip: 40000,
        showModalConfirm: false
    });
    const [form] = Form.useForm();



    function handleCancel() {
        props.onCancel();
    }





    function handleChangePayment(value) {
        console.log(value)
        if (value === 2) {
            setStateCheckout({ ...stateCheckout, onlinePayment: true })

        }
        else {
            setStateCheckout({ ...stateCheckout, onlinePayment: false })

        }
    }

    function handleChangeFeeShip(value) {

        setStateCheckout({ ...stateCheckout, feeShip: value })

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (props.userId === '') {
            setStateCheckout({
                ...stateCheckout, user: {},
                isMounted: true
            })
        }
        else {
            const data = axiosInstance(`User/get-user-by-id/${props.userId}`).then(res => res.data);

            setStateCheckout({
                ...stateCheckout, user: { ...data },
                isMounted: true,
            })
        }
    }, []);


    return stateCheckout.isMounted ? (<><Modal open={props.visible} footer={false} title="THỦ TỤC THANH TOÁN"
        onCancel={handleCancel} width={800}
    >
        <Spin spinning={props.isLoading} size="large">
            <Form onFinish={() => {
                var dataForm = form.getFieldsValue();
                var flag = dataForm;
                delete flag.note;
                var check = Object.values(flag).every(x => x === undefined);

                if (!check) {
                    props.handleShowConfirm(dataForm);
                }

            }}
                form={form}
                initialValues={{
                    displayname: stateCheckout.user.displayname,
                    email: stateCheckout.user.email,
                    phone: stateCheckout.user.phone,
                    feeShip: stateCheckout.feeShip,
                    payment: 1
                }}
            >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: "Xin vui lòng nhập Họ tên!",
                            }
                        ]} name="displayname" label="Họ tên" {...formItemLayout} labelAlign="left">
                            <Input type="text" placeholder="Họ tên"></Input>
                        </Form.Item>
                        <Form.Item rules={[
                            {
                                type: "email",
                                message: "Nhập email không hợp lệ!",
                            },
                            {
                                required: true,
                                message: "Xin vui lòng nhập email!",
                            },
                        ]} name="email" label="Email" {...formItemLayout} labelAlign="left">
                            <Input type="text" placeholder="Email"></Input>
                        </Form.Item>
                        <Form.Item rules={[
                            {
                                type: "phone",
                                message: "Nhập số điện thoại không hợp lệ!",
                            },
                            {
                                required: true,
                                message: "Xin vui lòng nhập số điện thoại!",
                            },
                        ]} name="phone" label="SĐT" {...formItemLayout} labelAlign="left">
                            <Input type="text" placeholder="Số điện thoại"></Input>
                        </Form.Item>
                        <Form.Item rules={[

                            {
                                required: true,
                                message: "Xin vui lòng nhập địa chỉ!",
                            },
                        ]} name="address" label="Địa chỉ" {...formItemLayout} labelAlign="left">
                            <Input type="text" placeholder="Địa chỉ"></Input>
                        </Form.Item>

                        <Form.Item name="note" label="Ghi chú" {...formItemLayout} labelAlign="left">
                            <TextArea placeholder="Ghi chú"></TextArea>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item required name="payment" label="Thanh toán" labelAlign="left" {...formItemLayout}>
                            <Select onChange={handleChangePayment}>
                                <Option value={1}>Thanh toán khi nhận hàng</Option>
                                {/* <Option value={2}>Thanh toán online</Option> */}
                            </Select>
                        </Form.Item>
                        <Form.Item required name="feeShip" label="Vận chuyển" labelAlign="left" {...formItemLayout}>
                            <Select onChange={handleChangeFeeShip}>
                                <Option value={40000}>Trong ngày mai (40.000 đ)</Option>
                                <Option value={20000}>Sau ngày mai (20.000 đ)</Option>
                            </Select>
                        </Form.Item>
                        {stateCheckout.onlinePayment === true ?
                            (
                                <StripeProvider apiKey="pk_test_51GsBkmDTOM2rV4A05njQTy9r2RSBuhuds67TGQsYmnDZcoP8qLkKTPbFEqlR8zQYOCKFvsrosssEdQoN1uTv3ILq00DL52AhHp">
                                    <Elements>
                                        <FormStripe total={props.total}></FormStripe>
                                    </Elements>
                                </StripeProvider>
                            ) : (<Fragment>
                                <Row>
                                    <Col span={20} offset={2}>
                                        <Timeline>
                                            <Timeline.Item dot={<ShoppingOutlined

                                                style={f_size_25} />}>
                                                <h4><Row>
                                                    <Col span={10}>Tiền mua: </Col>
                                                    <Col span={14}>{ParsePrice.parsePrice(props.total)} - VND</Col></Row></h4>
                                            </Timeline.Item>
                                            <Timeline.Item dot={<CarOutlined style={f_size_25} />}>
                                                <h4><Row>
                                                    <Col span={10}>
                                                        Vận chuyển: </Col>
                                                    <Col span={14}>{ParsePrice.parsePrice(stateCheckout.feeShip)} - VND</Col>
                                                </Row></h4>
                                            </Timeline.Item>
                                            <br></br>
                                            <Timeline.Item dot={<DollarCircleOutlined style={f_size_25} />}>
                                                <h3><Row>
                                                    <Col span={10}>
                                                        Tổng tiền: </Col>
                                                    <Col span={14}>{ParsePrice.parsePrice(props.total + stateCheckout.feeShip)} - VND
                                                    </Col>
                                                </Row>
                                                </h3>
                                            </Timeline.Item>
                                        </Timeline>
                                        {/*
                        <h4>Tiền mua: {ParsePrice.parsePrice(props.total)} - VND</h4>
                        <h4>Vận chuyển: {ParsePrice.parsePrice(state.feeShip)} - VND</h4>
                        <br></br>
                        <h3>Tổng tiền: {ParsePrice.parsePrice(props.total + state.feeShip)} - VND</h3>
                        */}
                                    </Col>
                                </Row>

                            </Fragment>)
                        }



                    </Col>

                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12} style={{ textAlign: 'end' }}>
                        <Button type="primary" onClick={handleCancel} danger>Hủy bỏ</Button>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">Xác nhận</Button>
                        </Form.Item>

                    </Col>
                </Row>
            </Form>
        </Spin>
    </Modal>
    </>) : <></>
}
const f_size_25 = {
    fontSize: 22,
    color: '#237804'
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.carts.isLoading
    }
}
export default connect(mapStateToProps, null)(ModelCheckoutV2);