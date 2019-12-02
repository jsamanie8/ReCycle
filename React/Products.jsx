import React from "react";
import logger from "sabio-debug";
import * as productService from "../../../services/productService";
import ProductCard from "./ProductCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import PropTypes from "prop-types";
const _logger = logger.extend("product");

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      mappedProducts: [],
      product: {
        id: "",
        name: "",
        description: "",
        productTypeId: "",
        vendorId: "",
        conditionTypeId: "",
        isVisible: "",
        isActive: "",
        primaryImage: "",
        specifications: ""
      },
      pageIndex: 1,
      pageSize: 0,
      totalCount: 0,
      totalPages: 0
    };
  }

  componentDidMount() {
    _logger(this.props.match.params.id);
    if (this.props.currentUser.id) {
      this.getProductsBySeller();
    }
  }

  getProductsBySeller = () => {
    _logger(this.state.pageIndex);
    productService
      .getByCurrent(this.state.pageIndex - 1, 12)
      .then(this.onGetProductsSuccess)
      .catch(this.onActionError);
  };

  onGetProductsSuccess = response => {
    _logger(response);
    const pgSize = response.item.pageSize;
    const tCount = response.item.totalCount;
    const tPages = response.item.totalPages;
    const products = response.item.pagedItems;
    this.setState({
      products,
      mappedProducts: products.map(this.mapProduct),
      pageSize: pgSize,
      totalCount: tCount,
      totalPages: tPages
    });
  };

  handleAdd = event => {
    event.preventDefault();
    this.props.history.push(
      `/admin/seller/${this.props.currentUser.id}/product/create`
    );
  };

  onChange = page => {
    _logger("page", page);
    this.setState({ pageIndex: page }, () => this.getProductsBySeller());
  };

  deactivateProduct = id => {
    productService
      .updateStatus(id, "false")
      .then(this.deactivateSuccess)
      .catch(this.onActionError);
  };

  deactivateSuccess = id => {
    _logger("Deactivate Successful");
    id = Number(id);

    this.setState(prevState => {
      let index = prevState.mappedProducts.findIndex(productComponent => {
        return productComponent.props.product.id === id;
      });
      if (index < 0) {
        return null;
      }

      const newProducts = [...prevState.products];
      newProducts[index].isActive = false;

      return {
        products: newProducts,
        mappedProducts: newProducts.map(this.mapProduct)
      };
    });
  };

  reactivateProduct = id => {
    productService
      .updateStatus(id, "true")
      .then(this.reactivateSuccess)
      .catch(this.onActionError);
  };

  reactivateSuccess = id => {
    _logger("Reactivate Successful");
    id = Number(id);

    this.setState(prevState => {
      let index = prevState.mappedProducts.findIndex(productComponent => {
        return productComponent.props.product.id === id;
      });
      if (index < 0) {
        return null;
      }

      const newProducts = [...prevState.products];
      newProducts[index].isActive = true;

      return {
        products: newProducts,
        mappedProducts: newProducts.map(this.mapProduct)
      };
    });
  };

  updateProduct = product => {
    this.props.history.push(
      `/admin/seller/${product.vendorId}/product/${product.id}/edit`,
      { product }
    );
  };

  productInformation = product => {
    this.props.history.push(
      `/admin/seller/${product.vendorId}/product/${product.id}/details`,
      { product }
    );
  };

  onActionError = errResponse => {
    _logger(errResponse);
    _logger("Error!");
  };

  mapProduct = product => (
    <ProductCard
      key={product.productId}
      product={product}
      deactivateProduct={this.deactivateProduct}
      reactivateProduct={this.reactivateProduct}
      updateProduct={this.updateProduct}
      productInformation={this.productInformation}
    />
  );

  render() {
    return (
      <React.Fragment>
        <div className="content-wrapper">
          <div className="content-heading">
            <div className="col-md-6 ">Products</div>
            <div className="offset-5">
              <button className="btn btn-success Add" onClick={this.handleAdd}>
                Create
              </button>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">{this.state.mappedProducts}</div>
        </div>
        <>
          <Pagination
            onChange={this.onChange}
            current={this.state.pageIndex}
            pageSize={this.state.pageSize}
            total={this.state.totalCount}
            showQuickJumper
            showSizeChanger
            locale={localeInfo}
            showTotal={(total, range) =>
              `${range[0]} - ${range[1]} of ${total} items`
            }
          />
        </>
      </React.Fragment>
    );
  }
}

Products.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  currentUser: PropTypes.object.isRequired
};

export default Products;
