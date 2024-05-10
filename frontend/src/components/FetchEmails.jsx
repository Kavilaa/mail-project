import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";

export const FetchEmails = ({
  user,
  endpoint,
  setEmails,
  setLoading,
  setError,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${user.token}`,
        };

        const response = await axiosInstance.get(endpoint, { headers });
        setEmails(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching emails."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, endpoint, setEmails, setLoading, setError]);

  return null;
};
