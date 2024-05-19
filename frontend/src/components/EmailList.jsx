import React from "react";
import trash from "../assets/trash.svg";

export const EmailList = ({
  emails,
  openEmailId,
  onEmailClick,
  onReply,
  onDelete,
  onArchive,
  onUnarchive,
}) => {
  return (
    <div>
      {emails.map((email) => (
        <div
          key={email._id}
          onClick={() => onEmailClick(email._id)}
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
            <button onClick={() => onDelete(email._id)}>
              <img
                className="color-red-500 border-2 border-red-500 rounded-lg "
                src={trash}
                alt=""
              />
            </button>
          </div>

          {openEmailId === email._id && (
            <div style={{ marginTop: "10px" }}>
              <p>{email.body}</p>
              <p>
                <strong>From: {email.sender}</strong> {email.from}
              </p>
              <p>
                <strong>To: {email.recipients.join(",")} </strong> {email.to}
              </p>
              <p>
                <strong>Date: {email.sentAt} </strong> {email.date}
              </p>
              <div className="flex space-x-2">
                {onReply && (
                  <button
                    className="border-gray-500 text-gray-500 border px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
                    onClick={() => onReply(email)}
                  >
                    Reply
                  </button>
                )}
                {onArchive && (
                  <button
                    className="border-blue-500 text-blue-500 border px-4 py-2 rounded-md hover:bg-blue-100 transition duration-200"
                    onClick={() => onArchive(email._id)}
                  >
                    Archive
                  </button>
                )}
                {onUnarchive && (
                  <button
                    className="border-blue-500 text-blue-500 border px-4 py-2 rounded-md hover:bg-blue-100 transition duration-200"
                    onClick={() => onUnarchive(email._id)}
                  >
                    Unarchive
                  </button>
                )}
                <button
                  className="border-red-500 text-red-500 border px-4 py-2 rounded-md hover:bg-red-100 transition duration-200"
                  onClick={() => onDelete(email._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
