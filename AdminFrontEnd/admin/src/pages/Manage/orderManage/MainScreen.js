import React, { Component } from 'react';
import { Row, Col, Statistic, Button, Card } from 'antd';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import '../../../components/common/styleCommon/Content.css';
import BreadScrumb from '../../../components/breadScrumb/BreadScrumb';
import { EditOutlined, LikeOutlined, ArrowUpOutlined, ArrowDownOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';
import axiosInstance from '../../../utils/axiosInstance';
import queryString from 'querystring';
import { connect } from 'react-redux';

class MainScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <Header></Header>
                <div className="main_container">
                    <Sidebar isActive="13"></Sidebar>
                    <div className="content">
                        <BreadScrumb title="Home"></BreadScrumb>
                        <br></br>
                        <div style={{ marginLeft: 24 }}>
                            Hello {this.props.name}
                        </div>
                    </div>
                </div>
            </>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        name: state.auth.nameUser,
        avatar: state.auth.avatar
    }
}

export default connect(mapStateToProps)(MainScreen);
