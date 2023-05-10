import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Spin } from 'antd';


function ForgetPasswordV2(props) {
    const [form] = Form.useForm();

    function onFinish(values) {
        props.onForgot(values.email);
        form.resetFields();
    }

    return (
        <div>

            <Form
                form={form}
                className="login-form"
                initialValues={{
                    email: '',
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    label="Email"
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
                    <Input placeholder="Nhập Email" />
                </Form.Item>
                <Row>
                    <Col lg={{ span: 4, offset: 10 }}>
                        <Button htmlType="submit" type="primary">Xác nhận</Button>
                    </Col>
                </Row>
            </Form>

        </div>
    )
}

export default ForgetPasswordV2;