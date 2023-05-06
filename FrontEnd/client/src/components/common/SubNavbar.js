import React, { Component } from "react";
import { Dropdown, Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import {
  BarsOutlined,
  EnvironmentOutlined,
  MenuUnfoldOutlined,
  MergeCellsOutlined,
  SkinOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../utils/axiosInstance";
import queryString from "query-string";
import { connect } from "react-redux";
import SmartText from "./SmartText";

const { SubMenu } = Menu;

class SubNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }
  async componentDidMount() {
    const data = await axiosInstance("Category/getAllCategory", "GET").then(
      (res) => res.data
    );
    this.setState({
      categories: data,
    });
  }
  handleClickCategory(item) {
    
    this.props.history.push({
      pathname: "/search/",
      search: queryString.stringify({
        searchKey: this.props.searchKey,
        categoryId: item.key,
        //
        currentPage: 1,
        pageSize: 3,
      }),
      hash: "#search-product",
      state: {
        fromDashboard: window.location.pathname === "/" || "" ? true : false,
      },
    });
  }
  render() {
    const { categories } = this.state;
    //custom menu
    const menu = (
      <Menu style={{ width: 220, background: "#ebebeb" }} mode="vertical">
        {categories.map((ele, index) => {
          return (
            <Menu.Item
              key={ele.id}
              onClick={this.handleClickCategory.bind(this)}
            >
              <SmartText text={ele.name} maxLength={30}></SmartText>
              
            </Menu.Item>
          );
        })}
      </Menu>
    );
    if (categories) {
      return (
        <div
          style={{
            paddingTop: 15,
            maxWidth: "100%",
            margin: "0 14px",
            display: "flex",
            justifyContent: "space-between",
            color:'#ffffff',
            background:'#000000',
            paddingRight:24,
            alignItems:'center',
            paddingBottom:5
          }}
        >
          <Dropdown overlay={menu}>
            <Link className="ant-dropdown-link" to="#">
              <h5 style={{ color: "#ffffff" }}>
                <BarsOutlined style={{ color: "black" }}></BarsOutlined>
                &nbsp; <MenuUnfoldOutlined style={{ color: "#ffffff" }}/> DANH MỤC SẢN PHẨM
              </h5>
            </Link>
          </Dropdown>
          <h5 style={{ color: "#ffffff" }}>
            <EnvironmentOutlined style={{ color: "red" }} /> Vận chuyển
          </h5>
          <h5 style={{ color: "#ffffff" }}>
            <MergeCellsOutlined style={{ color: "green" }} /> 30 ngày đổi trả dễ
            dàng
          </h5>
          <h5 style={{ color: "#ffffff" }}>
            <SkinOutlined style={{ color: "#13c2c2" }} /> Sản phẩm chính hãng
          </h5>
        </div>
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = (state) => {
  return {
    searchKey: state.products.searchKey,
    rating: state.products.rating,
    fromPrice: state.products.fromPrice,
    toPrice: state.products.toPrice,
    provider: state.products.provider,
  };
};
export default withRouter(connect(mapStateToProps, null)(SubNavbar));
