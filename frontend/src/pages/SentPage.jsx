import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { FetchEmails } from "../components/FetchEmails";
import { EmailList } from "../components/EmailList";
import { EmailActions } from "../components/EmailActions";
import { axiosInstance } from "../lib/axiosInstance";

export const SentPage = () => {
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEmailId, setOpenEmailId] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleEmailClick = (emailId) => {
    setOpenEmailId((prevId) => (prevId === emailId ? null : emailId));
  };

  const handleReply = (email) => {
    if (!email || !user) {
      console.error("Email or user is undefined.");
      return;
    }

    const prefilledSubject = `Re: ${email.subject}`;
    const formattedBody = `----
on ${email.sentAt}, ${email.sender} wrote:

${email.body}
---
on ${email.sentAt}, ${email.recipients} Replied:
`;
    let recipients = [];
    if (email.recipients) {
      recipients = email.recipients.filter(
        (recipient) => recipient !== user.email
      );
    }

    if (email.sender && email.sender !== user.email) {
      recipients.push(email.sender);
    }

    const recipientsString = recipients.join(", ");

    navigate("/compose", {
      state: {
        recipients: recipientsString,
        subject: prefilledSubject,
        body: formattedBody,
      },
    });
  };

  const handleDelete = async (emailId) => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      await axiosInstance.delete(`/emails/${emailId}`, { headers });

      setSentEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error deleting email:", err);
    }
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

      setSentEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error archiving email:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Sent Emails</h2>
        <EmailActions
          user={user}
          deleteEndpoint="/emails/sent/deleteall"
          onEmailsDeleted={() => setSentEmails([])}
        />
      </div>
      <FetchEmails
        user={user}
        endpoint="/emails/c/sent"
        setEmails={setSentEmails}
        setLoading={setLoading}
        setError={setError}
      />
      {loading ? (
        <div>Loading sent emails...</div>
      ) : error ? (
        <div>
          <p>Error fetching sent emails. Please try again later.</p>
          <button onClick={fetchEmails}>Retry</button>
        </div>
      ) : (
        <EmailList
          emails={sentEmails}
          openEmailId={openEmailId}
          onEmailClick={handleEmailClick}
          onReply={handleReply}
          onDelete={handleDelete}
          onArchive={handleArchive}
        />
      )}
    </div>
  );
};
