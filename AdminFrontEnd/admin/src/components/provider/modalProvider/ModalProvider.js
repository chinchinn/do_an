import React, { Component } from 'react';
import { Modal, Input, Button, Form, Row, Col } from 'antd';

const config = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },

}
export default class ModalProvider extends Component {
    handleSubmit(e) {

        debugger;
        const { data } = this.props;
        this.props.onSubmitForm({
            id: data.id,
            name: e.name,
            code: e.code,
            address: e.address,
            phoneNumber: e.phoneNumber,
            email: e.email,
            status: data.status,
        });
    }
    handleCancel() {
        this.props.onCancel(false)
    }
    handleChangeInput(e) {

        this.props.onChangeInput(e)
    }
    render() {

        const { data, visible } = this.props;
        return (
            <Modal

                title={data.id ? "Cập nhập nhà cung cấp" : "Thêm nhà cung cấp"}
                visible={visible}

                onCancel={this.handleCancel.bind(this)}
                footer={null}
            >
                <Form onFinish={this.handleSubmit.bind(this)} initialValues={
                    {
                        name: data.name,
                        code: data.code,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        email: data.email
                    }

                }
                >

                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                        <Col className="gutter-row" span={24}>
                            <Form.Item name="code" rules={[
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập mã nhà cung cấp!",
                                },

                            ]} {...config}
                                validateTrigger={['onChange']}
                                label="Mã nhà cung cấp" >
                                <Input type="text" maxLength={10} placeholder="mã nhà cung cấp"></Input>
                            </Form.Item>
                            <Form.Item name="name" rules={[
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập tên nhà cung cấp!",
                                }
                            ]} label="Tên nhà cung cấp"  {...config}>
                                <Input type="text" placeholder="Tên sản phẩm"></Input>
                            </Form.Item>

                            <Form.Item name="address" rules={[
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập địa chỉ nhà cung cấp!",
                                }
                            ]} label="Địa chỉ"  {...config}>
                                <Input type="text" placeholder="địa chỉ"></Input>
                            </Form.Item>
                            <Form.Item name="phoneNumber" rules={[
                                {

                                    message: "Xin vui lòng nhập number",
                                    pattern: new RegExp(/^[0-9]+$/)
                                },
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập số điện thoại!",
                                }
                            ]} label="Số điện thoại" {...config} >
                                <Input type="text" placeholder="số điện thoại"></Input>
                            </Form.Item>
                            <Form.Item name="email" rules={[
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập địa chỉ email!",
                                },
                                {
                                    type: 'email',
                                    message: 'Nhập email không hợp lệ!',
                                },

                            ]} label="Email"  {...config}>
                                <Input type="text" placeholder="email"></Input>
                            </Form.Item>

                        </Col>

                    </Row>


                    <Row>
                        <Col span={12} offset={6}>
                            <Form.Item>
                                <Button htmlType="submit" size="large" type="primary" block>Submit</Button>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        )
    }
}
