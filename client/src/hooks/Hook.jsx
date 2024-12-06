import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//custom hook for handle error
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

// custom hook for mutation data
const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();

  const executeMutation = async (toastMsg, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMsg || "Updating data...");

    try {
      const res = await mutate(...args);
      if (res.data) {
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Request failed", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

// custom hook for socket events
const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // cleanup
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
