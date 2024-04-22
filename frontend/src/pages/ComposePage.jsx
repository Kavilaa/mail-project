import React from "react";
import { Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

export const ComposePage = () => {
  const initialValues = {
    recipients: "",
    subject: "",
    body: "",
  };

  const validationSchema = Yup.object().shape({
    recipients: Yup.string()
      .matches(
        /^([\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,},\s*)*[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email or email list"
      )
      .required("Recipients are required"),
    subject: Yup.string()
      .min(3, "Subject must be at least 3 characters")
      .required("Subject is required"),
    body: Yup.string()
      .min(3, "Body must be at least 3 characters")
      .required("Body is required"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.post("/emails/compose", values);

      console.log("Email sent successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error sending email:", error);

      alert("Failed to send email. Please try again later.");
    }
  };

  return (
    <div className="max-w-xs mx-auto my-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="recipients" className="mb-4 block">
                Recipients
              </Label>
              <Input
                id="recipients"
                type="text"
                {...formikProps.getFieldProps("recipients")}
                placeholder="Enter recipient emails, separated by commas"
              />
              <ErrorMessage
                name="recipients"
                component="span"
                className="text-red-600 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="subject" className="mb-4 block">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                {...formikProps.getFieldProps("subject")}
                placeholder="Enter subject"
              />
              <ErrorMessage
                name="subject"
                component="span"
                className="text-red-600 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="body" className="mb-4 block">
                Body
              </Label>
              <textarea
                id="body"
                {...formikProps.getFieldProps("body")}
                rows={5}
                className="w-full p-2 border rounded"
                placeholder="Enter email body"
              />
              <ErrorMessage
                name="body"
                component="span"
                className="text-red-600 text-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="self-end"
                disabled={formikProps.isSubmitting}
              >
                Send Email
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
