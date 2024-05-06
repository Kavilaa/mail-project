import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export const ArchivedPage = () => {
  const [archivedEmails, setArchivedEmails] = useState([]);
  const { user } = useContext(AuthContext);
  const [openEmailId, setOpenEmailId] = useState(null);

  const fetchArchivedEmails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      const response = await axiosInstance.get("/c/archived", { headers });

      console.log("Response data:", response.data);

      setArchivedEmails(response.data);
    } catch (err) {
      console.error("Error fetching archived emails:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchArchivedEmails();
    }
  }, [user]);

  const handleUnarchive = async (emailId) => {
    try {
      // Set the headers for the request
      const headers = {
        Authorization: `Bearer ${user?.token}`, // Include the user's session information
      };

      const response = await axiosInstance.patch(
        `/emails/${emailId}`,
        {
          archived: false,
        },
        { headers }
      );

      console.log("Response from unarchive:", response.data);

      // Update the state by removing the unarchived email
      setArchivedEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error unarchiving email:", err);
    }
  };

  const handleEmailClick = (emailId) => {
    setOpenEmailId((prevId) => (prevId === emailId ? null : emailId));
  };

  return (
    <div>
      <h2>Archived Emails</h2>
      <div>
        {archivedEmails.map((email) => (
          <div
            key={email._id}
            onClick={() => handleEmailClick(email._id)}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <strong>{email.subject}</strong>

            {openEmailId === email._id && (
              <div style={{ marginTop: "10px" }}>
                <p>{email.body}</p>
                <p>
                  <strong>From: {email.sender}</strong> {email.from}
                </p>
                <p>
                  <strong>To: {email.recipients}</strong> {email.to}
                </p>
                <p>
                  <strong>Date: {email.sentAt} </strong> {email.date}
                </p>
                <button onClick={() => handleUnarchive(email._id)}>
                  Unarchive
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
