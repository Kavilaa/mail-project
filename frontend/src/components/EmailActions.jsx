import { axiosInstance } from "../lib/axiosInstance";

export const EmailActions = ({ user, deleteEndpoint, onEmailsDeleted }) => {
  const handleDeleteAll = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      await axiosInstance.delete(deleteEndpoint, { headers });

      onEmailsDeleted();
    } catch (err) {
      console.error("Error deleting all emails:", err);
    }
  };

  return (
    <button
      onClick={handleDeleteAll}
      className="text-red-500 hover:text-red-700"
    >
      Delete All
    </button>
  );
};
