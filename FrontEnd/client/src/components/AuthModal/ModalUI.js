import React, { Component } from "react";
import { Modal, Tabs, message } from "antd";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import { connect } from "react-redux";
import {
  fetch_register,
  fetch_login,
  login_fb_error,
  login_fb_success,
} from "../../action/authAction";
import ForgetPassword from "./ForgetPassword/ForgetPassword";
import axiosInstance from "../../utils/axiosInstance";
import SignInV2 from "./SignIn/SignInV2";
import SignUpV2 from "./SignUp/SignUpV2";
import ForgetPasswordV2 from "./ForgetPassword/ForgetPasswordV2";

const { TabPane } = Tabs;

class ModalUI extends Component {
  constructor() {
    super();
    this.state = {
      active: "1",
      isForgot: false,
    };
    this.callback = this.callback.bind(this);
  }
  onOk() {
    this.props.onOKAuthModal();
  }
  onCancel() {
    this.props.onCancelAuthModal();
  }

  callback(key) {
    debugger;
    this.setState({
      active: key,
    });
  }
  handleRegisterSuccess(value) {
    if (value) {
      this.setState({
        active: "1",
      });
    } else {
      this.setState({
        active: "2",
      });
    }
  }
  handleSignUp(values) {
    this.props.register(values);
  }
  handleSignIn(values) {
    this.props.login(values);
  }
  async handleForgotPassword(email) {
    await axiosInstance("User/ForgetPassword", "POST", { email: email }).then(
      (res) => {
        if (res.data === true) {
          message.success("Vui lòng vào Mail để Reset Password!", 4);
          this.props.onCancelAuthModal();
        } else {
          message.warning("Thất bại!", 4);
          this.props.onCancelAuthModal();
        }
      }
    );
  }
  //
  async handleLoginFb(values) {
    console.log(values);
    //this.props.login_with_fb(values);
    await axiosInstance("User/LoginWithFacebook", "POST", values)
      .then((res) => {
        if (!!res.data) {
          this.props.login_fb_success(res.data);
        }
      })
      .catch((err) => {
        console.log({ ...err });
        message.warning(`${err.response.data}`, 4);
        this.props.login_fb_error();
      });
  }
  render() {
    const { visible, onOKAuthModal, onCancelAuthModal } = this.props;
    return (
      <div>
        <Modal
          visible={visible}
          footer={false}
          onOk={onOKAuthModal}
          onCancel={onCancelAuthModal}
        >
          <Tabs activeKey={this.state.active} onChange={this.callback}>
            <TabPane tab="ĐĂNG NHẬP" key="1">
              {this.state.active === "1" ? (
                <SignInV2
                  onSignIn={this.handleSignIn.bind(this)}
                  onSignInNowClick={this.callback}
                  loginFb={this.handleLoginFb.bind(this)}
                ></SignInV2>
              ) : null}
            </TabPane>
            <TabPane tab="ĐĂNG KÝ" key="2">
              {this.state.active === "2" ? (
                <SignUpV2 onSignUp={this.handleSignUp.bind(this)}></SignUpV2>
              ) : null}
            </TabPane>
            <TabPane tab="" key="3">
              {this.state.active === "3" ? (
                <ForgetPasswordV2
                  onForgot={this.handleForgotPassword.bind(this)}
                ></ForgetPasswordV2>
              ) : null}
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    registerSuccess: state.auth.registerSuccess,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    register: (data) => {
      dispatch(fetch_register(data));
    },
    login: (data) => {
      dispatch(fetch_login(data));
    },
    login_fb_success: (data) => {
      dispatch(login_fb_success(data));
    },
    login_fb_error: () => {
      dispatch(login_fb_error());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ModalUI);
