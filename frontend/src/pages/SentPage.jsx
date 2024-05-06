import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export const SentPage = () => {
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEmailId, setOpenEmailId] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchSentEmails = async () => {
    console.log("User object:", user);
    console.log("User token:", user ? user.token : "undefined");

    if (!user) {
      console.error("User or token is missing. Cannot fetch sent emails.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };
      const response = await axiosInstance.get("/c/sent", { headers });

      console.log("Data received from /c/sent:", response.data);

      setSentEmails(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching sent emails:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching sent emails."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSentEmails();
    }
  }, [user]);

  if (loading) {
    return <div>Loading sent emails...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error fetching sent emails. Please try again later.</p>
        <button onClick={fetchSentEmails}>Retry</button>{" "}
      </div>
    );
  }

  const handleEmailClick = (emailId) => {
    setOpenEmailId((prevId) => (prevId === emailId ? null : emailId));
  };

  return (
    <div>
      <h2>Sent Emails</h2>
      <ul>
        {sentEmails.map((email) => (
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
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};
