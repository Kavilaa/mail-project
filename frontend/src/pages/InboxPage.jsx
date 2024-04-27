import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export const InboxPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEmailId, setOpenEmailId] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchEmails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const response = await axiosInstance.get("/c/inbox", { headers });
      setEmails(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching emails:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching emails."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmails();
    }
  }, [user]);

  const handleEmailClick = (emailId) => {
    setOpenEmailId((prevId) => (prevId === emailId ? null : emailId));
  };

  if (loading) {
    return <div>Loading emails...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error fetching emails: {error}</p>
        <button onClick={fetchEmails}>Retry</button>
      </div>
    );
  }

  const handleArchive = async (emailId) => {
    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const body = {
        archived: true,
      };

      await axiosInstance.patch(`/emails/${emailId}`, body, { headers });

      setEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error archiving email:", err);
    }
  };

  return (
    <div>
      <h2>Your Emails</h2>
      <div>
        {emails.map((email) => (
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
                <button onClick={() => handleArchive(email._id)}>
                  Archive
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
