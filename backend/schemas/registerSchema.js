import * as yup from "yup";

const registerSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

// module.exports = registerSchema;
export default registerSchema;
