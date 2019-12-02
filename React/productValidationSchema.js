import * as Yup from "yup";

let validationSchema = Yup.object().shape({
  manufacturer: Yup.string().required(
    "Manufacturer is Required. Must be between 2 and 100 characters."
  ),
  year: Yup.string().required("Year is Required. Must be in format: YYYY."),
  name: Yup.string().required(
    "Model is Required. Must be between 2 and 255 characters."
  ),
  description: Yup.string().required(
    "Description is Required. Must be between 2 and 4000 characters."
  ),
  productTypeId: Yup.string().required("Type of Bike is Required"),
  vendorId: Yup.string().required("Vendor Id is Required"),
  conditionTypeId: Yup.string().required("Condition of Bike is Required"),
  isVisible: Yup.string().required("A Selection is Required"),
  isActive: Yup.string().required("A Selection is Required"),
  primaryImage: Yup.string().required(
    "An Image URL is Required. Must be between 2 and 250 characters."
  )
  // specifications: Yup.string().required("Bike Specifications are Required")
});

export { validationSchema };
