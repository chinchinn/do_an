import React, { Component, Fragment } from 'react'
import BreadScrumb from '../components/BreadScrumb/BreadScrumb';
import Detail from '../components/productDetail/Detail';
import Evalution from '../components/evalution/Evaluation'
import ListEvaluation from '../components/listEvaluation/ListEvaluation';
import ListProducts from '../components/products/ListProducts';
import axiosInstance from '../utils/axiosInstance';
import './productDetail.css';

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topViewProducts: [],

            itemCount: 4,
            isLoadingTopViewProduct: true,
            pageCurrent: 1,
            pageSize: 8,
            totalPage: 0,
        }
    }

    async handleChangePage(page, pageSize) {
        let data = await axiosInstance('Product/Paging', 'POST', { pageCurrent: page, pageSize: pageSize })
            .then(res => res.data);
        this.setState({
            pageCurrent: page,
            pageSize: pageSize,
            mainProducts: data,
        })
    }

    handleClickViewMore(value) {
        this.setState({

            isLoadingTopViewProduct: true,
        })
        axiosInstance('Product/products-top-view-count/true')
            .then(res => {
                this.setState({
                    topViewProducts: [...res.data],
                    isLoadingTopViewProduct: false,
                })
            })
            .catch(err => console.log(err + ''))
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        axiosInstance('Product/products-top-view-count/false')
            .then(res => {
                this.setState({
                    topViewProducts: [...res.data],
                    isLoadingTopViewProduct: false,
                })
            })
            .catch(err => console.log(err + ''));
    }
    render() {
        const { pageCurrent, pageSize, totalPage } = this.state;
        return (
            <div style={{ background: '#f7f7f7' }}>
                <div style={{ width: '75%', margin: '0 auto', marginTop: '100px' }}>
                    <BreadScrumb title="Chi tiết sản phẩm"></BreadScrumb>
                    <Detail productId={this.props.match.params.productId}></Detail>

                    <Evalution productId={this.props.match.params.productId}></Evalution>
                    <ListEvaluation productId={this.props.match.params.productId}></ListEvaluation>

                    <div className='detail-view'>
                        <ListProducts title="NHỮNG SẢN PHẨM XEM NHIỀU" onClickViewMore={this.handleClickViewMore.bind(this)}
                            loading={this.state.isLoadingTopViewProduct} products={this.state.topViewProducts} pageCurrent={pageCurrent} pageSize={pageSize} totalPage={totalPage}
                            onChangePage={this.handleChangePage.bind(this)}></ListProducts>
                    </div>

                    <br></br>
                </div>
            </div>
        )
    }
}
export default ProductDetail;
