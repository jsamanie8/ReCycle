import React from "react";
import PropTypes from "prop-types";
import "./Product.css";

const ProductCard = props => {
  const handleDeactivate = () => {
    if (props.product.isActive) {
      props.deactivateProduct(props.product.id);
    } else {
      props.reactivateProduct(props.product.id);
    }
  };

  const handleUpdate = () => {
    props.updateProduct(props.product);
  };

  const handleReadMore = () => {
    props.productInformation(props.product);
  };

  return (
    <div className="container col-md-3">
      <div className="card mb-4">
        <img
          className={`${
            props.product.isActive
              ? "bd-placeholder-img centered-and-cropped"
              : "isDisabled"
            }`}
          width="100%"
          height="200"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
          src={props.product.primaryImage ? props.product.primaryImage : null}
          alt=""
        />
        <div className="card-body">
          <h3>{props.product.manufacturer} </h3>
          <h4>Model: {props.product.name} </h4>
          <p>Year: {props.product.year}</p>
          <p>Price: ${props.product.inventory.basePrice}</p>
          <p>Quantity: {props.product.inventory.quantity}</p>
          <br />
          <div className="details">
            <span
              className={`${
                props.product.isActive ? "underline" : "isDisabled"
                }`}
              onClick={handleReadMore}
            >
              Read More
            </span>

            <span className="float-right">
              <i
                className={`${
                  props.product.isActive
                    ? "fa-fw fa-sm fa fa-edit mr-2"
                    : "isDisabled"
                  }`}
                aria-hidden="true"
                onClick={handleUpdate}
              />
              <i
                className={`${
                  props.product.isActive
                    ? "fa-fw fa-sm fas fa-trash-alt mr-2"
                    : "fa-fw fa-sm fas fa-check mr-2"
                  }`}
                onClick={handleDeactivate}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    primaryImage: PropTypes.string.isRequired,
    manufacturer: PropTypes.string.isRequired,
    inventory: PropTypes.object.isRequired,
    year: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    specifications: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  }),
  deactivateProduct: PropTypes.func.isRequired,
  reactivateProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  productInformation: PropTypes.func.isRequired,
  productAddToCart: PropTypes.func.isRequired
};

export default ProductCard;
