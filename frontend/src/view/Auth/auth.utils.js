import { useEffect, useState } from "react";

// Function to get user data
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null; // Parse stored user data
  
};

// Function to check authentication
export const isAuth = () => {
  return !!getUser(); // Returns true if user exists
};

// Function to get the user role
export const getUserRole = () => {
  const user = getUser();
  return user ? user.data.roleId : null; // Returns roleId if user exists

};
export const getUserid = () => {
  const user = getUser();
  return user ? user.data.id : null;

};

// Custom hook to listen for authentication changes
export const isAuthenticated = () => {
  const [auth, setAuth] = useState(isAuth());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth(isAuth()); // Update state when authentication changes
    };

    window.addEventListener("userAuth", handleAuthChange);
    return () => window.removeEventListener("userAuth", handleAuthChange);
  }, []);

  return auth; // Return the authentication state
};
