import { Form, Formik, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import * as Yup from "yup";

export const LoginPage = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: Yup.string()
      // .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginUser = async (loginValues, { setSubmitting }) => {
    const response = await axiosInstance.post("/user/login", loginValues);
    setUser(response.data);
    setSubmitting(false);
    navigate("/");
  };

  return (
    <div className="max-w-xs mx-auto my-4 flex flex-col gap-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={loginUser}
      >
        {(formikProps) => {
          return (
            <Form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email" className="mb-4 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  {...formikProps.getFieldProps("email")}
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-4 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...formikProps.getFieldProps("password")}
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div className="flex items-center gap-4 justify-between">
                <span>
                  Don't have an account?{" "}
                  <Link className="text-blue-500" to="/register">
                    Register
                  </Link>
                </span>
                <Button
                  type="submit"
                  className="self-end"
                  disabled={formikProps.isSubmitting}
                >
                  Login
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
