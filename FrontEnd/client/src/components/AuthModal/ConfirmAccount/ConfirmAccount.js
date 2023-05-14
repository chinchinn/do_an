import React, { useState, Component, useEffect } from 'react';
import { Row, Col, Form, Input, Button, message, Avatar } from 'antd';
import queryString from 'query-string';
import { Redirect, useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { useDispatch } from 'react-redux';

import {
    login_success
} from "../../../action/authAction";


const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        }
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const containerStyle = {
    border: '1px solid #f0f0f0',
    padding: 20,
    borderRadius: 5,
    background: '#f0f0f0'
}
const titleStyle = {
    textAlign: 'center',
    padding: 15,
}


function ConfirmAccount() {


    var param = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const dispatch = useDispatch();




    async function onClickConfirm() {

        const token = queryParams.get('token').split(' ').join('+');
        const email = queryParams.get('email');
        if (!!token && !!email) {
            const body = {
                token: token.split(' ').join('+'),
                email: email
            }

            await axiosInstance('User/ConfirmAccount', 'POST', body)
                .then(res => {
                    if (res.data) {
                        message.success('Xác thực thành công!', 3);
                        window.location.href = "/"

                    }
                    else {
                        message.warning('Xác thực thất bại!', 3);
                    }
                })
        }
        else {
            window.location.href = "/"
        }

    }

    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>


        <Button style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }} onClick={onClickConfirm}>Xác thực</Button>
    </div>
}
export default ConfirmAccount;
