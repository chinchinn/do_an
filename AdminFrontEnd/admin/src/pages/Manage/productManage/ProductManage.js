import React, { Component } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import '../../../components/common/styleCommon/Content.css';
import axiosInstance from '../../../utils/axiosInstance';
import BreadScrumb from '../../../components/breadScrumb/BreadScrumb';
import { Table, Tag, Button, Spin, message, Popconfirm, Input, Row, Col, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ImportOutlined, SaveOutlined, RotateLeftOutlined } from '@ant-design/icons';
import ModalProduct from '../../../components/product/modalProduct/ModalProduct';
import ModalProductV2 from '../../../components/product/modalProduct/ModalProductV2';


const { Search } = Input;
const { Option } = Select;
const warn = "Bạn có chắc chắn muốn xóa sản phẩm này?";

const updateStatus = "Bạn có chắc muốn hiển thị sản phẩm này?";

export default class ProductManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providers: [],
      categories: [],
      data: [],
      item: {},
      pageDefault: 1,
      pageSize: 5,
      visible: false,
      isLoading: true,
      providerId: 0,
      categoryId: 0,
    }
  }
  handleClickBtn(record = null) {

    this.setState({
      visible: true,
      item: { ...record }
    })
  }
  callApi = async () => {
    let providers = await axiosInstance(`ManageProvider`, "GET")
      .then(res => {
        return res.data;
      }
      );
    let categories = await axiosInstance(`ManageCategory`, "GET")
      .then(res => {

        return res.data;
      }
      );
    let products = await axiosInstance(`ManageProduct`, "GET")
      .then(res => {
        return res.data;
      }
      );

    return this.setState({
      data: products,
      categories: categories,
      providers: providers,
      isLoading: false
    }
    )
  }
  async componentDidMount() {

    await this.callApi();
  }

  handleOk(value) {
    this.setState({
      visible: value
    })
  }
  handleCancel(value) {
    this.setState({
      visible: value
    })
  }
  handleSubmit(values) {
    this.setState({
      visible: false,
      isLoading: true,
    })


    values.sale = values.sale === undefined ? "0" : values.sale;
    values.description = values.description === null || values.description === undefined ? "" : values.description;
    let data = {
      id: values.id,
      name: values.name,
      importPrice: parseInt(values.importPrice),
      price: parseInt(values.price),
      sale: parseInt(values.sale),
      images: values.images,
      categoryId: values.categoryId,
      providerId: values.providerId,
      code: values.code,
      capacity: parseInt(values.capacity),
      description: values.description.split('\n').join(';'),
      amount: values.amount,
      viewCount: values.viewCount,
    }

    if (!values.id) {
      const productCreate = new FormData();
      productCreate.set("name", data.name);
      productCreate.set("importPrice", data.importPrice);
      productCreate.set("price", data.price);
      productCreate.set("sale", data.sale);
      productCreate.set("categoryId", data.categoryId);
      productCreate.set("providerId", data.providerId);
      productCreate.set("capacity", data.capacity);
      productCreate.set("code", data.code);
      productCreate.set("amount", data.amount);
      productCreate.set("description", data.description)
      values.images.forEach((element, index) => {
        productCreate.append(`images`, element.originFileObj);
      })
      axiosInstance('ManageProduct', 'POST', productCreate)
        .then(res => {

          this.setState({
            data: [...this.state.data, res.data],
            isLoading: false,
          })
        })
    }
    else {
      const productUpdate = new FormData();
      productUpdate.set("id", data.id);
      productUpdate.set("name", data.name);
      productUpdate.set("importPrice", data.importPrice);
      productUpdate.set("price", data.price);
      productUpdate.set("sale", data.sale);
      productUpdate.set("categoryId", data.categoryId);
      productUpdate.set("providerId", data.providerId);
      productUpdate.set("capacity", data.capacity);
      productUpdate.set("code", data.code);
      productUpdate.set("description", data.description);
      productUpdate.set("amount", data.amount);
      productUpdate.set("viewCount", data.viewCount);
      //let images = [];
      values.images.forEach((element, index) => {
        if (element.originFileObj) {
          console.log("file: ", element);
          productUpdate.append(`files`, element.originFileObj)
        }
        else {
          productUpdate.append(`images`, element.uid)
        }
      })

      axiosInstance('ManageProduct', 'PUT', productUpdate)
        .then(res => {
          return res.data;

        })
        .then(data => {
          if (data?.code != 99) {
            let tempData = [...this.state.data].filter(ele => ele.id !== values.id);
            let pageDefault = Math.ceil((tempData.length + 1) / this.state.pageSize);
            message.success(`${data.message}`, 2)
            this.callApi();
          }
          else {
            message.error(`${data.message}`, 2)
            this.setState({
              isLoading: false,
              visible: false,
            })
          }

        })
        .catch(err => console.log(err)
        )
    }
  }
  confirmDelete(record) {
    const { data } = this.state;
    let tempData = [...data];
    this.setState({ isLoading: true });

    if (record.status === 0) {
      axiosInstance(`ManageProduct/${record.id}`, 'DELETE')
        .then(res => {
          message.success(`${res.data.message}`, 2)
          this.setState({
            data: [...tempData].map(x => {

              if (x.id === record.id) {
                return { ...x, status: 1 }
              }
              else { return x }
            }),
            isLoading: false,
          })
        })
        .catch(err => {
          message.warning(`${err.toString()}`, 2)
          this.setState({ isLoading: false });
        })
    }
    else {

      axiosInstance(`ManageProduct/ChangeStatus/${record.id}`, 'POST')
        .then(res => {
          message.success(`Cập nhật thành công`, 2)
          this.setState({
            data: [...tempData].map(x => {

              if (x.id === record.id) {
                return { ...x, status: 0 }
              }
              else { return x }
            }),
            isLoading: false,
          })
        })
        .catch(err => {
          message.warning(`Cập nhật thất bại`, 2)
          this.setState({ isLoading: false });
        })

    }

  }
  handleChangeSelectCategory(e) {
    this.setState({
      categoryId: e
    })
  }
  handleChangeSelectProvider(e) {
    this.setState({
      providerId: e
    })
  }
  async handleSearchInput(value) {
    const { providerId, categoryId } = this.state;
    this.setState({
      isLoading: true,
    })
    let data = await axiosInstance('ManageProduct/search', 'POST', { providerId: providerId, categoryId: categoryId, searchKey: value })
      .then(res => res.data).catch(err => console.log(err));
    this.setState({
      data: [...data],
      isLoading: false,
      categoryId: 0,
      providerId: 0,
    })
  }
  //
  handleChangePrice(e, id) {
    const temp = [...this.state.data];
    temp.map((ele) => {
      if (ele.id === id) {
        ele[e.target.name] = e.target.value;
      }
      return ele;
    })
    this.setState({
      data: temp,
    })
  }
  //
  handleSaveItem(record) {
    const body = {
      id: record.id,
      newPrice: +record.price,
    }
    axiosInstance('ManageProduct/UpdatePrice', 'PUT', body)
      .then(res => {
        if (res) {
          message.success('Update Price Success!', 4);
        }
        else {
          message.warning('Update Price Failed!', 4);
        }
      })
  }
  render() {
    const { data, visible, item, isLoading, providers, categories } = this.state;
    const columns = [
      {
        title: 'Mã sản phẩm',
        dataIndex: 'code',
        key: 'code',
        render: text => <span>{text}</span>,
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        render: text => <span>{text}</span>,
      },
      {
        title: 'Giá nhập ( vnđ )',
        dataIndex: 'importPrice',
        width: '150px',
        key: 'importPrice',
        render: text => <span >{text}</span>
      },
      {
        title: 'Giá bán ( vnđ )',
        dataIndex: 'price',
        key: 'price',
        width: '230px',
        render: (text, record) => <><div style={{ display: 'inline-block', color: 'green', width: 100 }}>{text}</div>
          <Input name="price"
            style={{ width: 60 }} onChange={(e) => this.handleChangePrice(e, record.id)}>
          </Input> <Button style={{ color: 'white', borderColor: 'green', background: 'green' }}
            onClick={() => this.handleSaveItem(record)} icon={<SaveOutlined></SaveOutlined>}>
          </Button></>
      },
      // {
      //   title: 'Màu sắc',
      //   key: 'color',
      //   dataIndex: 'color',
      //   render: color => (
      //     <span>
      //       {
      //         color === 0 ? <Tag color={colors[color]} key={color}>
      //           {"White".toUpperCase()}
      //         </Tag> :
      //           <Tag color={colors[color]} key={color}>
      //             {colors[color].toUpperCase()}
      //           </Tag>
      //       }
      //     </span>
      //   ),
      // },
      // {
      //   title: 'Size',
      //   key: 'size',
      //   dataIndex: 'size',
      //   render: size => (
      //     <span>
      //       {

      //         <Tag color="default" key={size}>
      //           {sizes[size]}
      //         </Tag>
      //       }
      //     </span>
      //   ),
      // },
      {
        title: 'Sale ( % )',
        dataIndex: 'sale',
        key: 'sale',
        width: '100px',
        render: text => <span style={{ color: 'red' }}>{text}</span>
      },
      {
        title: 'Nhà cung ứng',
        dataIndex: 'provider',
        key: 'provider',
        render: prov => <span style={{}}>{prov.name}</span>
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: text => <span><Button style={text === 0 ? { background: '#4abd2b ', color: '#ffffff' } : { background: '#c10417', color: '#ffffff' }}>{text === 1 ? "Không hoạt động" : "Hoạt động"}</Button></span>
      },
      {
        title: (<Button icon={<ImportOutlined />} onClick={() => this.handleClickBtn()} style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }}>Thêm sản phẩm</Button>),
        key: 'Thao tác',
        width: '25%',
        render: (text, record, index) => (
          <span>

            <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 10, marginLeft: 10 }} disabled={record.status === 0 ? false : true}
              onClick={() => this.handleClickBtn(record)}>Cập nhật</Button>
            <Popconfirm placement="left" title={record.status === 0 ? warn : updateStatus} onConfirm={() => this.confirmDelete(record)} okText="Yes" cancelText="No">
              {record.status === 0 ? <Button icon={<DeleteOutlined />} type="danger">Xóa</Button>
                : <Button icon={<RotateLeftOutlined />}
                  style={{ background: "#389e0d", borderColor: "#389e0d", color: 'white' }}
                >Hiển thị</Button>}

            </Popconfirm>
          </span >
        ),
      },
    ];
    const datas = data.map(ele => {
      return { key: ele.id, ...ele }
    })
    return (
      <>
        <Header></Header>
        <div className="main_container">
          <Sidebar isActive="6"></Sidebar>
          <div className="content">

            <BreadScrumb title="Quản lý sản phẩm"></BreadScrumb>
            {
              isLoading ? <Spin size="large" tip="Loading data"><>
                <Table style={{ margin: '10px' }} columns={columns} dataSource={datas}
                  pagination={{
                    position: ["bottomCenter", "bottomCenter"],
                    defaultPageSize: 5
                  }}


                >
                </Table>
              </>
              </Spin> : (<>
                <div style={{ margin: 10 }}>
                  <Row>
                    <Col offset={5}>
                      <Select size="large" style={{ width: 150 }} placeholder="Danh mục" onChange={(e) => this.handleChangeSelectCategory(e)} name="categoryId">
                        {
                          categories.map(ele => {
                            return <Option key={ele.id} value={ele.id}>{ele.name}</Option>
                          })
                        }

                      </Select>
                    </Col>
                    <Col>
                      <Select size="large" style={{ width: 200 }} placeholder="Nhà cung cấp" onChange={(e) => this.handleChangeSelectProvider(e)} name="providerId">
                        {
                          providers.map(ele => {
                            return <Option key={ele.id} value={ele.id}>{ele.name}</Option>
                          })
                        }
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Search
                        placeholder="tìm kiếm..."
                        enterButton="tìm kiếm"

                        size="large"
                        onSearch={this.handleSearchInput.bind(this)}
                      />
                    </Col>
                  </Row>
                </div>
                <Table style={{ margin: '10px' }} columns={columns} dataSource={datas}
                  pagination={{
                    position: ["bottomCenter", "bottomCenter"],
                    defaultPageSize: this.state.pageSize,
                    defaultCurrent: this.state.pageDefault
                  }}
                >
                </Table>
                {
                  visible ?
                    <ModalProductV2 visible={visible} data={item}
                      onCancel={this.handleCancel.bind(this)} onSubmitForm={this.handleSubmit.bind(this)}></ModalProductV2> : ''
                }
              </>
              )
            }
          </div>
        </div>
      </>
    )
  }
}