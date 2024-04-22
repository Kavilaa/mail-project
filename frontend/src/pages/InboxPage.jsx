import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export const InboxPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchEmails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user._id}`,
      };

      const response = await axiosInstance.get("/", { headers });
      setEmails(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching emails:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [user]);

  if (loading) {
    return <div>Loading emails...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error fetching emails. Please try again later.</p>
        <button onClick={fetchEmails}>Retry</button>{" "}
      </div>
    );
  }

  return (
    <div>
      <h2>Your Emails</h2>
      <ul>
        {emails.map((email) => (
          <li key={email._id}>
            <strong>{email.subject}</strong> - {email.body}
          </li>
        ))}
      </ul>
    </div>
  );
};
