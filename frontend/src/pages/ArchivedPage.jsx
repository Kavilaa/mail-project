import React, { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { FetchEmails } from "../components/FetchEmails";
import { EmailList } from "../components/EmailList";
import { EmailActions } from "../components/EmailActions";
import { axiosInstance } from "../lib/axiosInstance";

export const ArchivedPage = () => {
  const [archivedEmails, setArchivedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEmailId, setOpenEmailId] = useState(null);
  const { user } = useContext(AuthContext);

  const handleEmailClick = (emailId) => {
    setOpenEmailId((prevId) => (prevId === emailId ? null : emailId));
  };

  const handleUnarchive = async (emailId) => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      const body = {
        archived: false,
      };

      await axiosInstance.patch(`/emails/${emailId}`, body, { headers });

      setArchivedEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error unarchiving email:", err);
    }
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Archived Emails</h2>
        <EmailActions
          user={user}
          deleteEndpoint="/emails/archived/deleteall"
          onEmailsDeleted={() => setArchivedEmails([])}
        />
      </div>
      <FetchEmails
        user={user}
        endpoint="/emails/c/archived"
        setEmails={setArchivedEmails}
        setLoading={setLoading}
        setError={setError}
      />
      {loading ? (
        <div>Loading archived emails...</div>
      ) : error ? (
        <div>
          <p>Error fetching archived emails. Please try again later.</p>
          <button onClick={fetchEmails}>Retry</button>
        </div>
      ) : (
        <EmailList
          emails={archivedEmails}
          openEmailId={openEmailId}
          onEmailClick={handleEmailClick}
          onDelete={handleDelete}
          onUnarchive={handleUnarchive}
        />
      )}
    </div>
  );
};
