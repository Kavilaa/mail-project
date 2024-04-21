import { Form, Formik, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

export const SentPage = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const registerUser = async (registerValues) => {
    try {
      const response = await axiosInstance.post(
        "/user/register",
        registerValues
      );
      setUser(response.data.user);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("Email already registered");
        alert("Email is already registered. Please try a different email.");
      } else {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <div className="max-w-xs mx-auto my-4">
      <Formik initialValues={initialValues} onSubmit={registerUser}>
        {(formikProps) => {
          return (
            <Form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="username" className="mb-4 block">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  {...formikProps.getFieldProps("username")}
                />
                <ErrorMessage
                  name="username"
                  component="span"
                  className="text-red-600 text-sm"
                />
              </div>
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
                  className="text-red-600 text-sm"
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
                  className="text-red-600 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="mb-4 block">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...formikProps.getFieldProps("confirmPassword")}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="span"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="flex items-center gap-4 justify-between">
                <span>
                  Already have an account?{" "}
                  <Link className="text-blue-500" to="/login">
                    Login
                  </Link>
                </span>
                <Button
                  type="submit"
                  className="self-end"
                  disabled={formikProps.isSubmitting}
                >
                  Register
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
