import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export const SentPage = () => {
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchSentEmails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };
      const response = await axiosInstance.get("/c/sent", { headers });
      setSentEmails(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching sent emails:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentEmails();
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

  return (
    <div>
      <h2>Sent Emails</h2>
      <ul>
        {sentEmails.map((email) => (
          <li key={email._id}>
            <strong>{email.subject}</strong> - {email.body}
          </li>
        ))}
      </ul>
    </div>
  );
};
