import axios from "axios";
import { toast } from "react-toastify";

const url = "/api";
export const APIKEY = import.meta.env.VITE_API_KEY;

export const API = axios.create({
  baseURL: url,
  params: {
    api_key: APIKEY,
    file_type: "json",
  },
});

export const handleError = (error: unknown) => {
  let errorMessage = "An error occurred. Please try again...";
  console.log("Error API key: ", error);

  // Check if the error is an Axios error
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorData = error.response?.data;

    if (errorData) {
      switch (status) {
        case 400:
          if (
            errorData.error_message?.includes("Value of frequency is not one")
          ) {
            errorMessage = `${errorData.error_message}. Change the frequency...`;
          } else {
            errorMessage =
              errorData.error_message ||
              "Bad request. Please check your input.";
          }
          break;
        case 401:
          // Clear storage and redirect to login
          localStorage.clear();
          window.location.href = "/login";
          return; // No need to show a toast for this case
        default:
          errorMessage = `${status || "Error"}: ${
            errorData.error_message || "Unexpected error occurred."
          }`;
      }
    } else {
      errorMessage = "No response from server. Please check your connection.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message || errorMessage;
  }

  // Show toast notification for the error
  toast.error(errorMessage, {
    position: "bottom-right",
    autoClose: 3500,
    theme: "dark",
  });
};
