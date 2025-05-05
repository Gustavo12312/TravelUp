import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import axios from 'axios';
import AuthService from '../utils/auth.service';
import authHeader from '../utils/auth.header';
import { useAuthentication, getUserid } from '../utils/auth.utils';
import { useRouter } from 'expo-router';
import { url } from './Host';

const baseUrl = url;

export default function CustomDrawerContent(props: any) {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const Authenticated = useAuthentication();
  

  useEffect(() => {
    const loadData = async () => {
      if (Authenticated) {
        const headers = await authHeader();
        const userId = await getUserid();
        setUserId(userId);
        const url = `${baseUrl}/user/get/${userId}`;
        try {
          const res = await axios.get(url, { headers });
          if (res.data.success) {
            setName(res.data.data.name);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    loadData();
  }, [Authenticated]); 
  

  const logOut = () => {
    AuthService.logout();
    router.replace('/login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: 'white' }}>
          Hello, {name}
        </Text>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/Detail/DetailEdit', params: { userId: String(userId) } })}
          style={{ marginBottom: 15 }}
        >
          <Text style={{ color: '#6190E6' }}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

