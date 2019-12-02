import React from "react";
import logger from "sabio-debug";
import { Formik, FastField, Form, Field } from "formik";
import * as productService from "../../../services/productService";
import * as fileService from "../../../services/fileService";
import * as validationSchema from "../product/productValidationSchema";
import PropTypes from "prop-types";
import Swal from "sweetalert";
import "./Product.css";
import Upload from "../../file/Upload";
import Preview from "../../file/Preview";
const _logger = logger.extend("product");

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        manufacturer: "",
        year: "",
        name: "",
        description: "",
        productTypeId: "",
        vendorId: this.props.currentUser.id,
        conditionTypeId: "",
        isVisible: true,
        isActive: true,
        primaryImage: "",
        specifications: [{ attribute: "", value: "" }]
      },
      fileData: [{}],
      preloadFiles: [],
      isUploading: false,
      isLoadingImage: false,
      mappedPreview: [],
      isEditing: false,
      buttonText: "Add a Product",
      productTypes: [],
      conditionTypes: []
    };
  }

  componentDidMount() {
    productService
      .getProductCombinedTypes()
      .then(this.onGetCombinedTypeSuccess)
      .catch(this.onActionError);
  }

  onGetCombinedTypeSuccess = response => {
    this.setState(
      () => {
        return {
          productTypes: response.item.productTypes.map(this.mapProductTypes),
          conditionTypes: response.item.conditionTypes.map(
            this.mapConditionTypes
          )
        };
      },
      () => this.prePopulateForm()
    );
  };

  prePopulateForm = () => {
    if (this.props.location.pathname.includes("create")) {
    } else {
      if (this.props.location.state) {
        const product = this.props.location.state.product;
        this.updateFormData(product);
      } else {
        productService
          .getById(this.props.match.params.id)
          .then(this.onGetByIdSuccess)
          .catch(this.onActionError);
      }
    }
  };

  mapProductTypes = product => (
    <option key={product.id} value={product.id}>
      {product.name}
    </option>
  );

  mapConditionTypes = condition => (
    <option key={condition.id} value={condition.id}>
      {condition.name}
    </option>
  );

  onGetByIdSuccess = response => {
    this.updateFormData(response.item);
  };

  updateFormData = value => {
    value.specifications = JSON.parse(value.specifications);
    const specArray = Object.keys(value.specifications).map(key => {
      return [key, value.specifications[key]];
    });
    this.setState({
      formData: {
        id: value.id,
        manufacturer: value.manufacturer,
        year: value.year,
        name: value.name,
        description: value.description,
        productTypeId: value.productTypeId,
        vendorId: value.vendorId,
        productTypeCondition: value.productTypeCondition,
        conditionTypeId: value.conditionTypeId,
        isVisible: value.isVisible,
        isActive: value.isActive,
        primaryImage: value.primaryImage ? value.primaryImage : "",
        specifications: specArray
      },
      isEditing: true,
      buttonText: "Update Product"
    });
  };

  handleSubmit = formValues => {
    const product = formValues;
    var obj = {};
    product.specifications.forEach(spec => {
      obj[spec[0]] = spec[1];
    });
    product.specifications = JSON.stringify(obj);
    if (formValues.id) {
      productService
        .update(product)
        .then(this.onUpdateSuccess)
        .catch(this.onSaveErrorGeneric);
    } else {
      productService
        .create(product)
        .then(this.onActionSuccess)
        .catch(this.onCreateError);
    }
  };

  handleAddSpecification = formikProps => {
    _logger("example", formikProps.values);
    const formData = formikProps.values;

    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...formData,
          specifications: prevState.formData.specifications.concat({
            attribute: "",
            value: ""
          })
        }
      };
    });
  };

  handleRemoveSpecification = (idx, formikProps) => () => {
    const formData = formikProps.values;
    this.setState({
      formData: {
        ...formData,
        specifications: this.state.formData.specifications.filter(
          (s, sidx) => idx !== sidx
        )
      }
    });
  };

  mapPreview = prev => <Preview prev={prev} />;

  onFileSelector = e => {
    const files = e.target.files;
    const formData = new FormData();
    let preloadFiles = [];
    if (files === null) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
      preloadFiles.push({
        name: formData.getAll("files")[i].name,
        id: this.state.id
      });
    }
    this.setState(() => {
      return {
        preloadFiles,
        isUploading: true,
        isLoadingImage: true
      };
    });
    fileService
      .upload(formData)
      .then(this.onUploadSuccess)
      .catch(this.onUploadError);
    _logger(formData.getAll("files"));
  };

  onUploadSuccess = response => {
    if (response.items === null) {
      return;
    }
    this.showPreview(response);
    this.setState(prevState => {
      return {
        ...prevState,
        isLoadingImage: false,
        formData: {
          ...prevState.formData,
          primaryImage: response.items[0].url
        }
      };
    });

    _logger(this.state.fileData);
  };

  onUploadError = () => {
    this.handleAbort();
  };

  newUpload = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        fileData: [{}],
        isUploading: false
      };
    });
  };

  handleAbort = () => {
    this.state.fileData.splice(0, this.state.fileData.length);
    this.newUpload();
  };

  showPreview = response => {
    if (response === null) {
      return;
    }
    let fileData = [];
    for (let i = 0; i < this.state.preloadFiles.length; i++) {
      var obj = {
        url: response.items[i].url,
        name: response.items[i].fileName
      };
      fileData.push(obj);
    }

    this.setState(prevState => {
      let prevFileData = [...prevState.fileData];
      return {
        ...prevState,
        fileData: prevFileData.concat(fileData),
        mappedPreview: response.items.map(this.mapPreview),
        isLoadingImage: true
      };
    });
  };

  onUploadError = () => {};

  newUpload = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        fileData: [{}],
        isUploading: false
      };
    });
  };

  handleChange = event => {
    let specifications = [...this.state.formData.specifications];
    specifications[event.target.dataset.id][event.target.name] =
      event.target.value;
    this.setState({ specifications });
  };

  handleReturn = event => {
    event.preventDefault();
    this.props.history.push(
      `/admin/seller/${this.props.match.params.id}/products`
    );
  };

  onUpdateSuccess = response => {
    _logger(response);
    _logger("Update Success!");
    Swal("Success", "Product updated!", "success");
    this.props.history.push(
      `/admin/seller/${this.state.formData.vendorId}/products`
    );
  };

  onActionSuccess = response => {
    _logger(response);
    _logger("Success");
    Swal({
      text: `Successfully added a product! Product Id: ${response.item}
           Product created will only show up once you have added inventory for it.`,
      buttons: ["Redirect to Inventory", "Go back to Products"]
    }).then(willDelete => {
      if (willDelete) {
        this.props.history.push(
          `/admin/seller/${this.props.match.params.id}/products`
        );
      } else {
        this.props.history.push(
          `/admin/sellers/${this.props.match.params.id}/inventory`
        );
      }
    });
  };

  onCreateError = errResponse => {
    _logger(errResponse);
    Swal("Oops", "There was an error!", "error");
    this.props.history.push(
      `/admin/seller/${this.props.match.params.id}/products`
    );
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
          validationSchema={validationSchema.validationSchema}
          enableReinitialize={true}
          render={formikProps => (
            <>
              <div className="row">
                <div className="col-md-7 offset-md-2">
                  <div className="card-default card">
                    <h3 className="card-header">
                      {" "}
                      {this.state.isEditing
                        ? "Update Product"
                        : "Add a Product"}
                    </h3>
                    <div className="card-body">
                      <Form>
                        <div className="form-row">
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="manufacturer">Manufacturer:</label>
                            <FastField
                              name="manufacturer"
                              placeholder="Enter Manufacturer"
                              component="input"
                              className="form-control"
                            />
                            {formikProps.touched.manufacturer &&
                              formikProps.errors.manufacturer && (
                                <div className="text-danger">
                                  {formikProps.errors.manufacturer}
                                </div>
                              )}
                          </div>
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="conditionTypeId">
                              Condition of Bike
                            </label>
                            <Field
                              className="form-control"
                              component="select"
                              name="conditionTypeId"
                            >
                              <option value="0">
                                --- Select Bike Condition ---
                              </option>
                              {this.state.conditionTypes}
                            </Field>
                            {formikProps.touched.conditionTypeId &&
                              formikProps.errors.conditionTypeId && (
                                <div className="text-danger">
                                  {formikProps.errors.conditionTypeId}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="year">Year:</label>
                            <FastField
                              component="input"
                              name="year"
                              placeholder="YYYY"
                              className="form-control"
                            />
                            {formikProps.touched.year &&
                              formikProps.errors.year && (
                                <div className="text-danger">
                                  {formikProps.errors.year}
                                </div>
                              )}
                          </div>
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="isVisible">Is Visible</label>
                            <Field
                              className="form-control"
                              component="select"
                              name="isVisible"
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </Field>
                            {formikProps.touched.isVisible &&
                              formikProps.errors.isVisible && (
                                <div className="text-danger">
                                  {formikProps.errors.isVisible}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="name">Model:</label>
                            <FastField
                              component="input"
                              name="name"
                              placeholder="Enter a Bike Model"
                              className="form-control"
                            />
                            {formikProps.touched.name &&
                              formikProps.errors.name && (
                                <div className="text-danger">
                                  {formikProps.errors.name}
                                </div>
                              )}
                          </div>
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="isActive">Is Active</label>
                            <Field
                              className="form-control"
                              component="select"
                              name="isActive"
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </Field>
                            {formikProps.touched.isActive &&
                              formikProps.errors.isActive && (
                                <div className="text-danger">
                                  {formikProps.errors.isActive}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="description">Description:</label>
                            <FastField
                              component="textarea"
                              name="description"
                              placeholder="Enter a Description"
                              className="form-control"
                            />
                            {formikProps.touched.description &&
                              formikProps.errors.description && (
                                <div className="text-danger">
                                  {formikProps.errors.description}
                                </div>
                              )}
                          </div>

                          <div className="position-relative form-group col-md-6"></div>
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="primaryImage">ImageUrl:</label>
                            <FastField
                              component="input"
                              name="primaryImage"
                              placeholder="Enter an Image Url or upload a photo"
                              className="form-control"
                            />
                            {formikProps.touched.primaryImage &&
                              formikProps.errors.primaryImage && (
                                <div className="text-danger">
                                  {formikProps.errors.primaryImage}
                                </div>
                              )}
                            {this.state.isEditing ? null : (
                              <>
                                <Upload
                                  name="primaryImage"
                                  className="form-control"
                                  onFileSelector={this.onFileSelector}
                                  isViewing={true}
                                />
                                {this.state.isLoadingImage ? (
                                  <div className="mt-2">
                                    <img
                                      src="https://sabio-training.s3-us-west-2.amazonaws.com/Recycle-36025c92-1ddf-4811-9571-0deac0d464be_@re-cycle-signature-logo-320x320 (2).gif"
                                      alt=""
                                      height="70"
                                      width="70"
                                    />
                                  </div>
                                ) : (
                                  this.state.mappedPreview
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="productTypeId">Type of Bike</label>
                            <Field
                              className="form-control"
                              component="select"
                              name="productTypeId"
                            >
                              <option value="0">
                                --- Select Type of Bike ---
                              </option>
                              {this.state.productTypes}
                            </Field>
                            {formikProps.touched.productTypeId &&
                              formikProps.errors.productTypeId && (
                                <div className="text-danger">
                                  {formikProps.errors.productTypeId}
                                </div>
                              )}
                          </div>

                          <div className="position-relative form-group col-md-6">
                            <label htmlFor="vendorId">VendorId:</label>
                            <FastField
                              component="input"
                              name="vendorId"
                              placeholder="Enter an Id between 1-5"
                              className="form-control"
                            />
                            {formikProps.touched.vendorId &&
                              formikProps.errors.vendorId && (
                                <div className="text-danger">
                                  {formikProps.errors.vendorId}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="position-relative form-group col-md-12">
                            {this.state.formData.specifications.map(
                              (specification, idx) => (
                                <div key={idx}>
                                  <div className="row">
                                    <i
                                      onClick={() =>
                                        this.handleAddSpecification(formikProps)
                                      }
                                      className="specs fas fa-plus"
                                    />
                                    <div className="col-md-5">
                                      <label htmlFor="attribute">
                                        Specification:
                                      </label>
                                      <Field
                                        component="input"
                                        name="attribute"
                                        id="attribute"
                                        value={specification[0]}
                                        onChange={this.handleChange}
                                        placeholder="Ex: Frame"
                                        className="attribute form-control "
                                        data-id={idx}
                                      />
                                    </div>

                                    <div className="col-md-5">
                                      <label htmlFor="value">Value:</label>
                                      <Field
                                        type="text"
                                        name="value"
                                        id="value"
                                        value={specification[1]}
                                        onChange={this.handleChange}
                                        placeholder="Ex: Carbon"
                                        data-id={idx}
                                        className="value form-control"
                                      />
                                    </div>
                                    <i
                                      className={`${
                                        this.state.formData.specifications[1]
                                          ? "values fas fa-minus"
                                          : "hidden"
                                      }`}
                                      onClick={this.handleRemoveSpecification(
                                        idx,
                                        formikProps
                                      )}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="float-left">
                            <i
                              className="return fas fa-arrow-left fa-2x"
                              onClick={this.handleReturn}
                            />
                          </span>
                          <span className="btn-group float-right" role="group">
                            <button
                              type="submit"
                              className="btn btn-primary btn-sm"
                            >
                              {this.state.buttonText}
                            </button>
                          </span>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        />
      </React.Fragment>
    );
  }
}

ProductForm.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
    pathname: PropTypes.string
  }),
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number
  })
};

export default ProductForm;
