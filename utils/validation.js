import validator from "validator";

export function validateSignUpData(req) {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("Please enter first name");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First Name should be between 4-50 letters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
}
