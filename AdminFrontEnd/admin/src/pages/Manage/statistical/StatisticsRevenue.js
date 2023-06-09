import React, { Component } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import '../../../components/common/styleCommon/Content.css';
import BreadScrumb from '../../../components/breadScrumb/BreadScrumb';
import Chart from "react-apexcharts";
import axiosInstance from '../../../utils/axiosInstance';
import { Row, Col, Select, Button, DatePicker, Card } from 'antd';
import ModalRevenue from '../../../components/statistics/modalRevenue/ModalRevenue'
import moment from 'moment';
import './StatisticsRevenue.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

function formatMomentArray(arrayMoment) {
  let result = arrayMoment.map((ele) => {
    return moment(ele._d).format('YYYY/MM/DD');
  })
  return result;
}
export default class StatisticsRevenue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //
      pageSize: 6,
      pageDefault: 1,
      //
      option: 1,
      month: 7,
      year: 2023,
      labels: [],
      countOrders: [],
      sumRevenues: [],
      tables: [],
      totalRevenue: 0,
      visible: false,
      optionTime: false,
      toDate: null,
      fromDate: null,

    };
  }
  callApi = async () => {

    const { option, month, year, toDate, fromDate, optionTime } = this.state;
    let data = await axiosInstance('Statistics', 'POST', { option: option, month: month, year: year, toDate: toDate, fromDate: fromDate, optionTime: optionTime })
      .then(res => { return res.data })
    let labels = data.map(e => e.date);
    let countOrders = data.map(e => e.countOrder);
    let sumRevenues = data.map(e => e.sumRevenue);
    let totalRevenue = sumRevenues.reduce((t, e) => t + e, 0);

    this.setState({
      labels: labels,
      countOrders: countOrders,
      sumRevenues: sumRevenues,
      tables: data,
      totalRevenue: totalRevenue,
    })
  }
  async componentDidMount() {
    await this.callApi();
  }
  handleChangeOption(e) {
    this.setState({
      option: e,
    })
  }
  handleChangeMonth(e) {
    this.setState({
      month: e,
    })
  }
  handleChangeYear(e) {
    this.setState({
      year: e,
    })
  }
  async handleClickStatisticsButton() {
    await this.callApi();
  }


  //
  handleViewDetailStatistics() {
    this.setState({
      visible: true,
    })
  }
  //
  handleCancelModal() {
    this.setState({
      visible: false,
    })
  }

  handleOptionTime() {
    this.setState({
      optionTime: !this.state.optionTime
    })
  }
  render() {
    const { option, month, year, labels, countOrders, sumRevenues, tables, visible, pageSize, pageDefault, optionTime, toDate, fromDate } = this.state;
    const series = [
      {
        name: 'Doanh thu',
        type: 'column',
        data: sumRevenues
      }, {
        name: 'Số đơn hàng',
        type: 'line',
        data: countOrders
      }
    ]
    const options = {
      noData: {
        text: undefined,
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined
        }
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: 'Doanh thu và số Đơn hàng',
        align: 'center',
        style: {

          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: 'sans serif',
          color: '#263238'
        }

      },
      dataLabels: {
        width: '30px',
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: labels,
      xaxis: {
        title: { text: optionTime ? `Doanh thu từ ngày ${fromDate ? fromDate : 'DD/MM/YYYY'} đến ngày ${toDate ? toDate : 'DD/MM/YYYY'} ` : option === 0 ? `Các tháng trong năm ${year}` : `Các ngày trong tháng ${month} / ${year}` },
        type: 'month',

      },
      yaxis: [{
        title: {
          text: 'Doanh thu',
        },
        labels: {
          formatter: (value) => { return value + " VNĐ" },
        }
      }, {
        opposite: true,
        title: {
          text: 'Số đơn hàng'
        }
      }]
    }

    return (
      <>

        <Header></Header>
        <div className="main_container">
          <Sidebar isActive="9"></Sidebar>
          <div className="content">


            <BreadScrumb title="Thống kê doanh thu"></BreadScrumb>

            <Row style={{ margin: '24px 0px 0px 24px ' }} >
              <Col span={8}>
                <Card title="Thu nhập" color='#001529' className='card-report' bordered={true}>
                  Tổng thu nhập: {this.state.totalRevenue} đồng
                </Card>
              </Col>

            </Row>

            <Chart
              options={options}
              series={series}
              type="line"
              height="550"
            />

            <Row style={{ background: '#fafafa', padding: '10px' }}>


              {this.state.optionTime ? <Col span={5} offset={1} style={{ paddingRight: 4 }}>

                <RangePicker onChange={(value) => {
                  var array = formatMomentArray(value);
                  this.setState({
                    fromDate: array[0],
                    toDate: array[1]
                  });
                }} format={'DD/MM/YYYY'}
                />
              </Col> : <><Col offset={1}>
                <Select defaultValue={option}
                  onChange={this.handleChangeOption.bind(this)}
                  style={{ width: 200 }}
                >
                  <Option value={1}>Các ngày trong tháng</Option>
                  <Option value={0}>Các Tháng trong năm</Option>
                </Select>
              </Col>
                <Col offset={1}>
                  <Select defaultValue={month}
                    onChange={this.handleChangeMonth.bind(this)}
                    style={{ width: 200 }}
                  >
                    <Option value={1}>Tháng 1</Option>
                    <Option value={2}>Tháng 2</Option>
                    <Option value={3}>Tháng 3</Option>
                    <Option value={4}>Tháng 4</Option>
                    <Option value={5}>Tháng 5</Option>
                    <Option value={6}>Tháng 6</Option>
                    <Option value={7}>Tháng 7</Option>
                    <Option value={8}>Tháng 8</Option>
                    <Option value={9}>Tháng 9</Option>
                    <Option value={10}>Tháng 10</Option>
                    <Option value={11}>Tháng 11</Option>
                    <Option value={12}>Tháng 12</Option>
                  </Select>
                </Col>

                <Col offset={1} style={{ paddingRight: 4 }}>
                  <Select defaultValue={year}
                    onChange={this.handleChangeYear.bind(this)}
                    style={{ width: 200 }}
                  >
                    <Option value={2023}>2023</Option>
                    <Option value={2022}>2022</Option>
                    <Option value={2021}>2021</Option>
                    <Option value={2020}>2020</Option>
                    <Option value={2019}>2019</Option>

                  </Select>
                </Col></>}

              <Col style={{ paddingRight: 4 }}>
                <Button type="primary" onClick={this.handleClickStatisticsButton.bind(this)}>Thống kê</Button>
              </Col>
              <Col style={{ paddingRight: 4 }}>
                <Button style={{ background: '#52c41a', border: '1px solid #52c41a' }}
                  type="primary" onClick={this.handleViewDetailStatistics.bind(this)}>Xem Chi tiết</Button>
              </Col>
              <Col style={{ paddingRight: 4 }}>
                <Button type="default" onClick={this.handleOptionTime.bind(this)}>Đổi lựa chọn kiểu ngày thống kê</Button>
              </Col>

            </Row>
            {visible ? <ModalRevenue visible={visible}
              tables={tables}
              pageSize={pageSize}
              pageDefault={pageDefault}
              onCancel={this.handleCancelModal.bind(this)}
            >

            </ModalRevenue> : null}

          </div>

        </div >
      </>
    )
  }
}