import { extend } from "vee-validate";

import {
  confirmed,
  email,
  min,
  max,
  required,
} from "vee-validate/dist/rules";

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
    const numberRegex = /^(?=.*[0-9])/;
    return numberRegex.test(value);
  },
});

extend("uppercase", {
  message: "Must contain at least one uppercase character",
  validate: value => {
    const uppercaseRegex = /^(?=.*[A-Z])/;
    return uppercaseRegex.test(value);
  },
});

extend("special_char", {
  message: "Must contain at least one special character",
  validate: value => {
    const specialCharRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    return specialCharRegex.test(value);
  },
});

extend("alpha_num_spaces", {
	message: "Should contain only letters, numbers and spaces",
	validate: value => {
		const alphaNumSpacesRegex = /^[a-z\d\s]+$/i;
		return alphaNumSpacesRegex.test(value);
	}
})
