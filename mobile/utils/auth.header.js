import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function authHeader() {
  try {
    const userData = await AsyncStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);

      if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
      }
    }

    return {};
  } catch (error) {
    console.error('Error reading auth header:', error);
    return {};
  }
}
