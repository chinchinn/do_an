import React, { Component } from 'react';
import './totalCart.css';
import { connect } from 'react-redux';
import * as ParsePrice from '../../helper/parsePriceForSale';
import ModalCheckout from '../listCart/modalCheckout/ModalCheckout';
import axios from 'axios';
import { handle_checkout_cart } from '../../action/cartsAction';
import ModelCheckoutV2 from './modalCheckout/ModelCheckoutV2';
import { Modal } from 'antd';
import ModalViewOrderDetail from '../UserPage/InfoUser/ModalViewOrderDetail';


class TotalCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false,
            dataForm: {},
            visibleModalConfirm: false,
            feeShip: 0,
            customerItem: '',
            note: null,
            orderDetailList: [],
        }
    }

    handleCheckout() {
        debugger;
        this.setState({
            visibleModal: true,
        })
    }
    handleCancelModalCheckout() {
        this.setState({
            visibleModal: false,
        })
    }
    handleCreateOrder = (order) => {

        this.props.create_order(order);
    }
    handleShowConfirm = (dataForm) => {
        debugger;
        const carts = JSON.parse(localStorage.getItem('carts'));

        const orderDetails = carts.map((ele) => {
            return {
                id: ele.id,
                orderId: ele.id,
                order: ele.id,
                quantity: ele.quantity,
                productId: ele.category?.id,
                product: ele.category?.name,
                picture: ele?.images?.[0]?.urlImage,
                sale: ele.sale,
                unitPrice: ele.importPrice,
                amount: ele.price,
                key: ele.id,
            }
        });
        this.setState({
            dataForm: dataForm,
            visibleModalConfirm: true,
            orderDetailList: orderDetails,
            feeShip: dataForm?.feeShip,
            customerItem: dataForm?.displayname,
            note: dataForm?.note,

        })
    }

    handleSubmitCheckout = () => {
        debugger;
        //this.props.onCreateOrder();
        const carts = JSON.parse(localStorage.getItem('carts'));
        //format orderdetail
        const orderDetail = carts.map((ele) => {
            return { quantity: ele.quantity, unitPrice: ele.price, sale: ele.sale, productId: ele.id }
        })
        //console.log(values.note.split('\n'));
        if (this.props.userId) {
            this.handleCreateOrder({
                userId: this.props.userId,
                phone: this.state.dataForm.phone,
                email: this.state.dataForm.email,
                total: this.props.total + this.state.dataForm.feeShip,
                feeShip: this.state.dataForm.feeShip,
                address: this.state.dataForm.address,

                note: this.state.dataForm.note?.split('\n')?.join(';'),
                OrderDetails: orderDetail
            })
        }
        else {
            this.handleCreateOrder({
                guess: this.state.dataForm.displayname,
                phone: this.state.dataForm.phone,
                email: this.state.dataForm.email,
                total: this.props.props.total + this.state.dataForm.feeShip,
                feeShip: this.state.dataForm.feeShip,
                address: this.state.dataForm.address,

                note: this.state.dataForm.note.split('\n').join(';'),
                OrderDetails: orderDetail
            })
        }


    }
    render() {
        const {
            feeShip,
            customerItem,
            orderId,
            orderDetailList,
            note } = this.state;
        return (
            <>
                <div className="container-total-cart">
                    <div className="container-total">
                        <div className="price-total price-temp">
                            <strong>Tạm tính: </strong>
                            <b>{ParsePrice.parsePrice(this.props.total)} đ</b>

                        </div>
                        <div className="price-total">
                            <strong>Thành tiền: </strong>
                            <b style={{ fontSize: '20px', color: '#f5222d' }}>{ParsePrice.parsePrice(this.props.total)} đ</b>

                        </div>
                        <div style={{ padding: '15px', textAlign: 'end' }}>
                            <p>(Đã bao gồm VAT nếu có)</p>
                        </div>

                    </div>
                    <div>
                        <button className="book-cart-btn" onClick={this.handleCheckout.bind(this)}>
                            Tiến hành đặt hàng
                        </button>
                    </div>
                    {

                        this.state.visibleModal ? <ModelCheckoutV2

                            onCreateOrder={this.handleCreateOrder.bind(this)}
                            total={this.props.total} userId={this.props.userId}
                            onCancel={this.handleCancelModalCheckout.bind(this)}
                            visible={this.state.visibleModal}
                            handleShowConfirm={this.handleShowConfirm.bind(this)}
                        >

                        </ModelCheckoutV2> : ""
                    }

                    {/* {
                        this.state.visibleModalConfirm ? <Modal open={true}
                            onOk={this.handleSubmitCheckout.bind(this)}
                            confirmLoading={this.props.isLoading}
                            onCancel={() => {
                                this.setState({
                                    visibleModalConfirm: false
                                })
                            }}>
                            <div >
                                <div>
                                    <span>Kiểm tra thông tin đặt hàng</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    lineHeight: 2
                                }}>
                                    <span>Họ và tên : {this.state.dataForm.displayname}</span>
                                    <span>Email :  {this.state.dataForm.email}</span>
                                    <span>Số điện thoại : {this.state.dataForm.phone}</span>
                                    <span>Địa chỉ : {this.state.dataForm.address}</span>
                                </div>
                            </div>
                        </Modal> : ""
                    } */}



                    {
                        this.state.visibleModalConfirm ?
                            <ModalViewOrderDetail
                                visible={this.state.visibleModalConfirm}
                                onCancel={() => {
                                    this.setState({
                                        visibleModalConfirm: false
                                    })
                                }

                                }
                                handleSubmit={(value) => {
                                    debugger;
                                    this.handleSubmitCheckout();
                                }}
                                data={orderDetailList}
                                feeShip={feeShip}
                                customer={customerItem}
                                note={note}
                                isSubmit = {true}

                            >
                            </ModalViewOrderDetail> : null
                    }

                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        total: state.carts.total,
        carts: state.carts.carts,
        userId: state.auth.userId,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        create_order: (order) => { dispatch(handle_checkout_cart(order)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalCart);