import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export const ArchivedPage = () => {
  const [archivedEmails, setArchivedEmails] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchArchivedEmails = async () => {
    try {
      const response = await axiosInstance.get("/c/archived");

      console.log("Response data:", response.data);

      setArchivedEmails(response.data);
    } catch (err) {
      console.error("Error fetching archived emails:", err);
    }
  };

  useEffect(() => {
    fetchArchivedEmails();
  }, []);

  const handleUnarchive = async (emailId) => {
    try {
      const response = await axiosInstance.patch(`/emails/${emailId}`, {
        archived: false,
      });

      console.log("Response from unarchive:", response.data);

      setArchivedEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error unarchiving email:", err);
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
