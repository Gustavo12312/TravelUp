import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get user data
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
};

// Function to check authentication
export const isAuth = async () => {
  const user = await getUser();
  return !!user;
};

// Function to get the user role
export const getUserRole = async () => {
  const user = await getUser();
  return user?.data?.roleId || null;
};

// Function to get user ID
export const getUserid = async () => {
  const user = await getUser();
  return user?.data?.id || null;
};

// Custom hook to listen for authentication changes
export const useAuthentication = () => {
  const [auth, setAuth] = useState(false);  // Let TypeScript infer the type automatically

  useEffect(() => {
    // Define a function that sets the state asynchronously
    const checkAuth = async () => {
      try {
        const authenticated = await isAuth();  // Await async result
        setAuth(authenticated);  // Set the auth state based on the result
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuth(false); // In case of error, set authentication to false
      }
    };

    checkAuth();  // Call the checkAuth function once when the component mounts

    // Poll every second to check authentication status
    const interval = setInterval(checkAuth, 1000);

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, []);  // Empty dependency array ensures it runs once on mount

  return auth;  // Return the authentication state
};
