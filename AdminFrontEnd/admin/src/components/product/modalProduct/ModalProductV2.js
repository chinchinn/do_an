import React, { Component } from 'react';
import { Modal, Input, Form, Upload, Select, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance';
import { useState } from 'react';
import { useEffect } from 'react';
import queryString from 'querystring';
const { TextArea } = Input;
const { Option } = Select;

const config = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
}

function ModalProductV2(props) {
    const [form] = Form.useForm();

    const [modalProduct, setModalProduct] = useState({
        categories: [],
        providers: [],
        imageList: [],
        colors: [],
        sizes: [],
    });



    const { categories, providers } = modalProduct;
    const { data, visible } = props;


    useEffect(() => {
        const { images } = props.data;
        Promise.all([
            axiosInstance('ManageCategory', 'GET'),
            axiosInstance('ManageProvider', 'GET'),
        ]).then(res => {
            setModalProduct({
                ...modalProduct,
                categories: [...res[0].data],
                providers: [...res[1].data],
                imageList: images ? images.map(ele => {
                    return { uid: ele.id, url: ele.urlImage, status: ele.status, productId: ele.productId }
                }) : [],
            })
        })

    }, [props.data])

    useEffect(() => {
        return () => {
            setModalProduct({
                ...modalProduct,
                categories: [],
                providers: [],
                imageList: [],
                colors: [],
                sizes: [],
            })
        }
    }, [])



    function handleCancel() {
        props.onCancel(false)
    }
    function handleChange({ fileList }) {

        setModalProduct({ ...modalProduct, imageList: fileList })

    }
    const handleUpload = file => {
        //fake api
        const upload = `https://localhost:5001/api/ManageProduct/image`;
        return (
            upload
        )
    }

    function handleSubmitForm(values) {

        const { imageList } = modalProduct;
        const { data } = props;

        values = form.getFieldsValue();
        var item = values;

        form
            .validateFields()
            .then(i => {

                form.resetFields();
                var detail = { id: data.id, ...item, images: [...imageList] }
                props.onSubmitForm(detail);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });



    }

    const validateCode = async (rule, value) => {

        if (!data.code) {
            let check = await axiosInstance(`ManageProduct/check-duplicate?${queryString.stringify({
                code: value,
            })}`, 'GET')
                .then(res => res.data);

            if (check) {
                throw new Error('Mã code bị lặp');
            }

        }


    };



    const handleRemoveImage = file => {
        console.log(file);

    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    return (

        <Modal

            width={800}
            title={data.id ? "Cập nhập sản phẩm" : "Thêm sản phẩm"}
            visible={visible}
            onCancel={handleCancel}
            footer={null}

        >
            <div>
                <Form onFinish={handleSubmitForm} initialValues={
                    {
                        name: data.name,
                        importPrice: data.importPrice,
                        price: data.price,
                        sale: data.sale,
                        code: data.code,
                        capacity: data.capacity,
                        categoryId: data.categoryId,
                        providerId: data.providerId,
                        description: !!data.description ? data.description.split(';').join('\n') : null,
                        amount: data.amount,
                        viewCount: data.viewCount,
                    }
                }
                    form={form}>
                    <Row>
                        <Col span={18} offset={3}>
                            <Form.Item>
                                <Upload onChange={handleChange} listType="picture-card"
                                    fileList={modalProduct?.imageList}
                                    action={handleUpload}
                                    onRemove={handleRemoveImage}
                                >
                                    {modalProduct?.imageList?.length >= 5 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                        <Col className="gutter-row" span={12}>
                            <Form.Item name="code" rules={[
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập mã sản phẩm!",
                                },
                                { validator: validateCode, validateTrigger: ['onChange'] },
                            ]}
                                validateTrigger={['onChange']}

                                // help={validate ? "Mã code bị trùng" : ""}
                                // validateStatus={!validate ? "success" : "error"}

                                label="Mã sản phẩm" {...config}>
                                <Input disabled={data?.code ? true : false} type="text" maxLength={10} placeholder="Mã sản phẩm"></Input>
                            </Form.Item>
                            <Form.Item name="name" rules={[
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập tên sản phẩm!",
                                }
                            ]} label="Tên sản phẩm" {...config}>
                                <Input type="text" placeholder="Tên sản phẩm"></Input>
                            </Form.Item>
                            <Form.Item name="importPrice" rules={[
                                {

                                    message: "Xin vui lòng nhập number",
                                    pattern: new RegExp(/^[0-9]+$/)
                                },
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập giá nhập!",
                                }
                            ]} label="Giá nhập (VNĐ)" {...config}>
                                <Input type="text" placeholder="Giá nhập" ></Input>
                            </Form.Item>
                            <Form.Item rules={[
                                {

                                    message: "Xin vui lòng nhập number",
                                    pattern: new RegExp(/^[0-9]+$/)
                                },
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập giá bán!",
                                }

                            ]} name="price" label="Giá bán (VNĐ)" {...config}>
                                <Input type="text" placeholder="Giá bán"></Input>
                            </Form.Item>
                            <Form.Item name="sale" label="Giảm giá (%)" {...config}>
                                <Input type="text" placeholder="Giảm giá"></Input>
                            </Form.Item>
                            <Form.Item name="viewCount" label="Lượng xem" {...config}>
                                <Input disabled type="text" placeholder="lượng xem"></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <Form.Item name="amount" rules={[
                                {

                                    message: "Xin vui lòng nhập number",
                                    pattern: new RegExp(/^[0-9]+$/)
                                },
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập số lượng!",
                                }
                            ]} label="Số lượng" {...config}>
                                <Input type="text" placeholder="số lượng"></Input>
                            </Form.Item>
                            <Form.Item name="categoryId" rules={[
                                {
                                    required: true,
                                    message: "Xin vui lòng nhập danh mục!",
                                }
                            ]} label="Danh mục" {...config}>
                                <Select
                                    //defaultValue={data.categoryId}
                                    placeholder="danh mục"
                                >
                                    {
                                        categories?.map((ele) => {
                                            return <Option key={ele.id} value={ele.id}>{ele.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item name="providerId" label="Nhà cung cấp" {...config}
                                rules={[
                                    {
                                        required: true,
                                        message: "Xin vui lòng nhập nhà cung cấp!",
                                    }
                                ]} >
                                <Select
                                    //defaultValue={data.providerId}
                                    placeholder="nhà cung cấp"
                                >
                                    {
                                        providers?.map((ele) => {
                                            return <Option key={ele.id} value={ele.id}>{ele.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item name="capacity" label="Dung tích" {...config}
                                rules={[{

                                    message: "Xin vui lòng nhập number",
                                    pattern: new RegExp(/^[0-9]+$/)
                                },
                                {
                                    required: true,
                                    message: "Xin vui lòng dung tích",

                                }]
                                } >
                                <Input type="text" placeholder="dung tích"></Input>
                            </Form.Item>

                        </Col>
                    </Row>

                    <Form.Item name="description" label="Mô tả" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <TextArea placeholder="Mô tả" />
                    </Form.Item>
                    <Row>
                        <Col span={12} offset={6}>
                            <Form.Item>
                                <Button htmlType="submit" size="large" type="primary" block>Submit</Button>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </div>
        </Modal>

    )
}
export default ModalProductV2;

