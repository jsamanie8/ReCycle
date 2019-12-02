import React from "react";
import PropTypes from "prop-types";
import * as productService from "../../../services/productService";
import logger from "sabio-debug";
import Swal from "sweetalert";
import "./Product.css";
import Comments from "../../comment/Comments";
const _logger = logger.extend("ProductDetails");

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetails: {
        id: 0,
        manufacturer: "",
        primaryImage: "",
        name: "",
        year: "",
        description: "",
        specifications: [],
        sku: ""
      }
    };
  }

  componentDidMount() {
    if (this.props.location.state.product) {
      const product = this.props.location.state.product;
      this.productData(product);
    } else {
      productService
        .getById(this.props.match.params.productId)
        .then(this.onGetByIdSuccess)
        .catch(this.onActionError);
    }
  }

  productData = value => {
    value.specifications = JSON.parse(value.specifications);
    this.setState({
      productDetails: {
        id: value.id,
        basePrice: value.inventory.basePrice,
        quantity: value.inventory.quantity,
        manufacturer: value.manufacturer,
        name: value.name,
        year: value.year,
        description: value.description,
        productTypeId: value.productTypeId,
        vendorId: value.vendorId,
        conditionTypeId: value.conditionTypeId,
        isVisible: value.isVisible,
        isActive: value.isActive,
        primaryImage: value.primaryImage ? value.primaryImage : "",
        specifications: value.specifications,
        sku: value.sku
      }
    });
  };

  onGetByIdSuccess = response => {
    this.productData(response.item);
  };

  handleAddedToCart = event => {
    event.preventDefault();
    _logger(event.target);
  };

  handleReturn = event => {
    event.preventDefault();
    this.props.history.push("/shop");
  };

  onActionError = errResponse => {
    _logger(errResponse);
    Swal("Oops", "There was an error!", "error");
  };

  render() {
    return (
      <>
        <div className="content-wrapper">
          <div className="row">
            <div className="productdetails col-lg-6">
              <img
                className="card-img-top col-center"
                src={
                  this.state.productDetails.primaryImage
                    ? this.state.productDetails.primaryImage
                    : null
                }
                alt=".."
              />
            </div>
            <div className="col-lg-6">
              <strong>
                <h1 style={{ marginLeft: 0, fontSize: "4rem" }}>
                  {this.state.productDetails.manufacturer}{" "}
                  {this.state.productDetails.name}{" "}
                  {this.state.productDetails.year}
                </h1>
              </strong>

              <h2>
                <strong style={{ fontSize: "2rem" }}>
                  Price: ${this.state.productDetails.basePrice}
                </strong>
                <hr />
              </h2>
              <h4>
                Quantity: <strong>{this.state.productDetails.quantity}</strong>
              </h4>
              <hr />
              <h4>
                SKU: <strong>{this.state.productDetails.sku}</strong>
              </h4>
              <hr />

              <div className="a text-align-center">
                <button
                  type="button"
                  className="btn btn-warning btn-lg btn-block  "
                  style={{ padding: "0 8px" }}
                  onClick={this.handleAddedToCart}
                >
                  <i className="ficon-cart" aria-hidden="true" />
                  <strong>Add to Cart</strong>
                </button>
              </div>

              <i
                className="return fas fa-arrow-left fa-2x"
                onClick={this.handleReturn}
              />
            </div>

            <div className="col-lg-12">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <a
                    className="nav-item nav-link active"
                    id="nav-description-tab"
                    data-toggle="tab"
                    href="#nav-description"
                    role="tab"
                    aria-controls="nav-description"
                    aria-selected="true"
                  >
                    Description
                  </a>
                  <a
                    className="nav-item nav-link"
                    id="nav-reviews-tab"
                    data-toggle="tab"
                    href="#nav-reviews"
                    role="tab"
                    aria-controls="nav-reviews"
                    aria-selected="false"
                  >
                    Reviews
                  </a>
                  <a
                    className="nav-item nav-link"
                    id="nav-producttag-tab"
                    data-toggle="tab"
                    href="#nav-producttag"
                    role="tab"
                    aria-controls="nav-producttag"
                    aria-selected="false"
                  >
                    Product Tag
                  </a>
                  <a
                    className="nav-item nav-link"
                    id="nav-specifications-tab"
                    data-toggle="tab"
                    href="#nav-specifications"
                    role="tab"
                    aria-controls="nav-specifications"
                    aria-selected="false"
                  >
                    Specifications
                  </a>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-description"
                  role="tabpanel"
                  aria-labelledby="nav-description-tab"
                >
                  {" "}
                  <span>{this.state.productDetails.description}</span>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-reviews"
                  role="tabpanel"
                  aria-labelledby="nav-reviews-tab"
                >
                  <div className="container tab" />
                  <Comments
                    entityId={parseInt(this.props.match.params.id)}
                    entityTypeId={23}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-producttag"
                  role="tabpanel"
                  aria-labelledby="nav-producttag-tab"
                >
                  <h3>
                    SKU: <strong>{this.state.productDetails.sku}</strong>{" "}
                  </h3>
                </div>
                <div
                  className="tab-pane fade "
                  id="nav-specifications"
                  role="tabpanel"
                  aria-labelledby="nav-specifications-tab"
                >
                  <h3>
                    Color:{this.state.productDetails.specifications["Color"]}
                    <br />
                    Material:
                    {this.state.productDetails.specifications["Material"]}
                    <br />
                    Size:{this.state.productDetails.specifications["Size"]}
                  </h3>

                  <i
                    className="return fas fa-arrow-left fa-2x"
                    onClick={this.handleReturn}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

ProductDetails.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object
  }),

  match: PropTypes.shape({
    params: PropTypes.object
  }),

  currentUser: PropTypes.shape({
    id: PropTypes.number
  })
};
export default ProductDetails;
