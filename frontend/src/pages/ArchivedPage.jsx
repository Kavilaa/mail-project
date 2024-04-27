import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export const ArchivedPage = () => {
  const [archivedEmails, setArchivedEmails] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchArchivedEmails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };
      // Send a GET request to fetch archived emails
      const response = await axiosInstance.get("/c/archived", { headers });

      // Log the response data for debugging
      console.log("Response data:", response.data);

      // Update the archivedEmails state with the response data
      setArchivedEmails(response.data);
    } catch (err) {
      console.error("Error fetching archived emails:", err);
      // Optional: Display error message to the user
    }
  };

  useEffect(() => {
    // Call the function to fetch archived emails when the component mounts
    fetchArchivedEmails();
  }, []);

  const handleUnarchive = async (emailId) => {
    try {
      // Send a PATCH request to unarchive the email
      const response = await axiosInstance.patch(`/emails/${emailId}`, {
        archived: false,
      });

      // Log the response data for debugging
      console.log("Response from unarchive:", response.data);

      // Update the archivedEmails state by removing the unarchived email
      setArchivedEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error unarchiving email:", err);
      // Optional: Display error message to the user
    }
  };

  return (
    <div>
      <h2>Archived Emails</h2>
      <div>
        {archivedEmails.map((email) => (
          <div key={email._id}>
            <strong>{email.subject}</strong>
            <div style={{ marginTop: "10px" }}>
              <p>{email.body}</p>
              <p>
                <strong>From:</strong> {email.from}
              </p>
              <p>
                <strong>To:</strong> {email.to}
              </p>
              <p>
                <strong>Date:</strong> {email.date}
              </p>
              <button onClick={() => handleUnarchive(email._id)}>
                Unarchive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
