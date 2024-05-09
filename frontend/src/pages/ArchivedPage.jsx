import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import trash from "../assets/trash.svg";

export const ArchivedPage = () => {
  const [archivedEmails, setArchivedEmails] = useState([]);
  const { user } = useContext(AuthContext);
  const [openEmailId, setOpenEmailId] = useState(null);
  const [emails, setEmails] = useState([]);

  const fetchArchivedEmails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      const response = await axiosInstance.get("/emails/c/archived", {
        headers,
      });

      // console.log("Response data:", response.data);

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
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      const response = await axiosInstance.patch(
        `/emails/${emailId}`,
        {
          archived: false,
        },
        { headers }
      );

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

  const handleDelete = async (emailId) => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      await axiosInstance.delete(`/emails/${emailId}`, { headers });

      setArchivedEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error deleting email:", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      await axiosInstance.delete(`/emails/archived/deleteall`, { headers });

      setArchivedEmails([]);
    } catch (err) {
      console.error("Error deleting all archived emails:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Archived Emails</h2>
        <button
          onClick={handleDeleteAll}
          className="text-red-500 hover:text-red-700"
        >
          Delete All
        </button>{" "}
      </div>
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
                    className="border-blue-500 text-blue-500 border px-4 py-2 rounded-md hover:bg-blue-100 transition duration-200"
                    onClick={() => handleUnarchive(email._id)}
                  >
                    Unarchive
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
      </div>
    </div>
  );
};
