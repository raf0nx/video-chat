import { extend } from "vee-validate";

import {
  alpha_num,
  confirmed,
  email,
  min,
  max,
  required,
} from "vee-validate/dist/rules";

extend("alpha_num", {
  ...alpha_num,
  message: "Should contain only letters and numbers",
});

extend("confirmed", {
  ...confirmed,
  message: "Please make sure your passwords match",
});

extend("email", {
  ...email,
  message: "Email seems not to be valid",
});

extend("min", {
  ...min,
  message: "Must be at least {length} characters",
});

extend("max", {
  ...max,
  message: "Must not be greater than {length} characters",
});

extend("required", {
  ...required,
  message: "This field is required",
});

extend("number", {
  message: "Must contain at least one number",
  validate: value => {
    const numberRegex = new RegExp("^(?=.*[0-9])");
    return numberRegex.test(value);
  },
});

extend("uppercase", {
  message: "Must contain at least one uppercase character",
  validate: value => {
    const uppercaseRegex = new RegExp("^(?=.*[A-Z])");
    return uppercaseRegex.test(value);
  },
});

extend("special_char", {
  message: "Must contain at least one special character",
  validate: value => {
    const specialCharRegex = new RegExp("^(?=.*[!@#$%^&*])(?=.{8,})");
    return specialCharRegex.test(value);
  },
});
