import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import trash from "../assets/trash.svg";

export const SentPage = () => {
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEmailId, setOpenEmailId] = useState(null);
  const [emails, setEmails] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchSentEmails = async () => {
    // console.log("User object:", user);
    // console.log("User token:", user ? user.token : "undefined");

    if (!user) {
      console.error("User or token is missing. Cannot fetch sent emails.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };
      const response = await axiosInstance.get("/emails/c/sent", { headers });

      // console.log("Data received from /c/sent:", response.data);

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

  const handleDeleteAll = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      await axiosInstance.delete("/emails/sent/deleteall", { headers });

      setSentEmails([]);
    } catch (err) {
      console.error("Error deleting all emails:", err);
    }
  };

  const handleDelete = async (emailId) => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      if (!emailId || typeof emailId !== "string") {
        console.error("Invalid email ID:", emailId);
        return;
      }

      const response = await axiosInstance.delete(`/emails/${emailId}`, {
        headers,
      });

      if (response.status === 200) {
        setSentEmails((prevEmails) =>
          prevEmails.filter((email) => email._id !== emailId)
        );
      } else {
        console.error("Failed to delete email:", response.data);
      }
    } catch (err) {
      console.error("Error deleting email:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Your Emails</h2>
        <button
          onClick={handleDeleteAll}
          className="text-red-500 hover:text-red-700"
        >
          Delete All
        </button>{" "}
      </div>
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
            <div className="flex justify-between items-center">
              <strong>{email.subject}</strong>
              <button onClick={() => handleDelete(email._id)}>
                <img src={trash} alt="" />
              </button>
            </div>

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
                <div className="flex space-x-2">
                  <button
                    className="border-gray-500 text-gray-500 border px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
                    onClick={() => handleReply(email._id)}
                  >
                    Reply
                  </button>

                  <button
                    className="border-blue-500 text-blue-500 border px-4 py-2 rounded-md hover:bg-blue-100 transition duration-200"
                    onClick={() => handleArchive(email._id)}
                  >
                    Archive
                  </button>

                  <button
                    className="border-red-500 text-red-500 border px-4 py-2 rounded-md hover:bg-red-100 transition duration-200"
                    onClick={() => handleDelete(email._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};
