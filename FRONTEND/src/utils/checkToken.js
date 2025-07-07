import { jwtDecode } from "jwt-decode";

export const checkTokenValidity = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    const isExpired = Date.now() >= exp * 1000;
    if (isExpired) {
      localStorage.removeItem("jwtToken");
      alert("Your session has expired. Please sign in again.");
      window.location.href = "/signin";
      return false;
    }
    return true;
  } catch (err) {
    localStorage.removeItem("jwtToken");
    alert("Invalid session. Please sign in again.");
    window.location.href = "/signin";
    return false;
  }
};
