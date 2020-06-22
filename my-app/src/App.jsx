import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import {
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import Axios from "axios";
const API_URL = `http://localhost:3001`;

class App extends React.Component {
  state = {
    products: [],
    productForm: {
      productName: "",
      productPrice: "",
      productDesc: "",
      productImage: "",
    },
    editProductForm: {
      productName: "",
      productPrice: "",
      productDesc: "",
      productImage: "",
    },
    showEdit: false,
    productId: 0,
  };

  inputTextHandler = (event, form, field) => {
    const { value } = event.target;
    this.setState({ [form]: { ...this.state[form], [field]: value } });
  };

  fileChangeHandler = (e, form, field) => {
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: e.target.files[0],
      },
    });
  };

  addProduct = () => {
    let productForm = new FormData();
    productForm.append(
      "productForm",
      JSON.stringify({ ...this.state.productForm, productImage: null })
    );
    productForm.append("productImage", this.state.productForm.productImage);

    Axios.post(`${API_URL}/products/add`, productForm)
      .then((res) => {
        console.log(res.data);
        this.getProduct();
        this.setState({
          productForm: {
            ...this.state.productForm,
            productName: "",
            productPrice: "",
            productDesc: "",
            productImage: "",
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getProduct = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        console.log(res.data);
        this.setState({ products: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteProduct = (productId) => {
    Axios.delete(`${API_URL}/products/delete`, {
      params: {
        productId,
      },
    })
      .then((res) => {
        console.log(res.data);
        this.getProduct();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  showEditForm = (productId, index) => {
    this.setState({
      showEdit: !this.state.showEdit,
      productId: productId,
      // editProductForm: {
      //   ...this.state.products[index],
      // },
    });
    console.log(this.state.products[index]);
  };

  renderProductForm = () => {
    return (
      <>
        <Form className="mb-4 col-4">
          <FormGroup>
            <Label>Product ID</Label>
            <Input
              type="text"
              placeholder="Product Name"
              value={this.state.productId}
              onChange={(e) => {
                this.inputTextHandler(e, "editProductForm", "productName");
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Product Name</Label>
            <Input
              type="text"
              placeholder="Product Name"
              value={this.state.editProductForm.productName}
              onChange={(e) => {
                this.inputTextHandler(e, "editProductForm", "productName");
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Product Price</Label>
            <Input
              type="text"
              placeholder="Product Price"
              value={this.state.editProductForm.productPrice}
              onChange={(e) => {
                this.inputTextHandler(e, "editProductForm", "productPrice");
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Product Description</Label>
            <Input
              type="textarea"
              placeholder="Product Desc"
              value={this.state.editProductForm.productDesc}
              onChange={(e) => {
                this.inputTextHandler(e, "editProductForm", "productDesc");
              }}
            />
          </FormGroup>
          <FormGroup>
            <img
              src={this.state.editProductForm.productImage}
              alt=""
              style={{ width: "100px" }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleFile">Product Image</Label>
            <Input
              type="file"
              name="file"
              id="exampleFile"
              // value={this.state.editProductForm.productImage}
              onChange={(e) => {
                this.fileChangeHandler(e, "editProductForm", "productImage");
              }}
            />
            <FormText color="muted">Upload product image</FormText>
          </FormGroup>
          <Button type="button" onClick={this.editProduct}>
            Edit
          </Button>
        </Form>
      </>
    );
  };
  editProduct = () => {
    let productForm = new FormData();
    productForm.append(
      "productForm",
      JSON.stringify({ ...this.state.editProductForm, productImage: null })
    );
    productForm.append("productImage", this.state.editProductForm.productImage);
    console.log(
      JSON.stringify({ ...this.state.editProductForm, productImage: null })
    );
    console.log(this.state.productId);
    Axios.put(`${API_URL}/products/update`, productForm, {
      params: {
        productId: this.state.productId,
      },
    })
      .then((res) => {
        console.log(res.data);
        this.getProduct();
        this.setState({
          editProductForm: {
            ...this.state.editProductForm,
            productName: "",
            productPrice: "",
            productDesc: "",
            productImage: "",
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  renderProduct = () => {
    return this.state.products.map((value, index) => {
      return (
        <>
          <tr>
            <td>{index + 1}</td>
            <td>
              <img
                src={value.productImage}
                alt=""
                style={{ width: "100px" }}
                className="rounded"
              />
            </td>
            <td>{value.productName}</td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(value.productPrice)}
            </td>
            <td>{value.productDesc}</td>
            <td>
              <Button
                type="button"
                value="Delete"
                onClick={() => this.showEditForm(value.id, index)}
              >
                Edit
              </Button>
            </td>
            <td>
              <Button
                type="button"
                value="Delete"
                onClick={() => this.deleteProduct(value.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        </>
      );
    });
  };
  componentDidMount() {
    this.getProduct();
  }
  render() {
    return (
      <div className="d-flex p-4 flex-column justify-content-start align-items-center">
        <h3 className="mb-4">PRODUCT LIST</h3>
        <div className="d-flex justify-content-around col-12 mb-4">
          <Form className="col-4">
            <FormGroup>
              <Label>Product Name</Label>
              <Input
                type="text"
                placeholder="Product Name"
                value={this.state.productForm.productName}
                onChange={(e) => {
                  this.inputTextHandler(e, "productForm", "productName");
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Product Price</Label>
              <Input
                type="text"
                placeholder="Product Price"
                value={this.state.productForm.productPrice}
                onChange={(e) => {
                  this.inputTextHandler(e, "productForm", "productPrice");
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Product Description</Label>
              <Input
                type="textarea"
                placeholder="Product Desc"
                value={this.state.productForm.productDesc}
                onChange={(e) => {
                  this.inputTextHandler(e, "productForm", "productDesc");
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleFile">Product Image</Label>
              <Input
                type="file"
                name="file"
                id="exampleFile"
                onChange={(e) => {
                  this.fileChangeHandler(e, "productForm", "productImage");
                }}
              />
              <FormText color="muted">Upload product image</FormText>
            </FormGroup>
            <Button type="button" onClick={this.addProduct}>
              Add
            </Button>
          </Form>
          {this.state.showEdit ? this.renderProductForm() : null}
        </div>
        <Table className="mb-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>{this.renderProduct()}</tbody>
        </Table>
      </div>
    );
  }
}
export default App;