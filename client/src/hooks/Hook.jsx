import { useEffect } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) return fallback();
        else
          return toast.error(
            error?.response?.data?.message || "Something went wrong"
          );
      }
    });
  });
};

export { useErrors };
