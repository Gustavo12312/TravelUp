import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '@/components/Host';

class AuthService {
  async login(email, password) {
    try {
      const res = await axios.post(url + '/user/login', { email, password });
      
      if (res.data.token) {
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
      }
      console.log(res.data)

      return res.data;
    } catch (error) {
      throw new Error('Utilizador Inválido');
    }
  }

  async register(name, email, password, roleId) {
    try {
      const res = await axios.post(url + '/user/register', {
        name,
        email,
        password,
        roleId,
      });

      if (res.data.token) {
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
      }

      return res.data;
    } catch (error) {
      throw new Error('Utilizador Inválido');
    }
  }

  async logout() {
    await AsyncStorage.removeItem('user');
  }

  async getCurrentUser() {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}

export default new AuthService();
