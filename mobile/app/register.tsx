import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'expo-router';
import authHeader from '../utils/auth.header';
import { useAuth } from '../utils/auth.context';
import { Dropdown } from 'react-native-element-dropdown'; 
import { url } from '@/components/Host';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Image } from 'react-native';

const baseUrl = url;

type FormData = {
    username: string;
    email: string;
    password: string;
    roleId: number;
  };

  type Role = {
    id: number;
    label: string;
  };

export default function RegisterComponent() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();
   const { register, userId, getUserId } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
        username: "",
        email: "",
        password: "",
        roleId: 0,
      }
  });

  useEffect(() => {
   LoadData();
  }, []);

  const LoadData = async ()=> {
    axios.get(`${baseUrl}/role/list`, { headers: await authHeader() })
      .then((res) => {
        if (res.data.success) {
          setRoles(res.data.data);
        } else {
          setMessage('Error fetching roles.');
        }
      })
      .catch(() => setMessage('Error fetching roles.'));
  }

  const createdetail = async () => {
    const id = await getUserId();
    const postUrl = `${baseUrl}/detail/create`;

    await axios.post(postUrl, { userId: id }, { headers: await authHeader() })
      .catch(error => {
        Alert.alert("Error", "Could not create detail: " + error.message);
      });
  };

  const onSubmit = async (data: FormData) => {
    setMessage('');
    setLoading(true);

    const { username, email, password, roleId } = data;

    try {
      const res = await register(username, email, password, roleId);
      if (!res) {
        setMessage("Register failed.");
      } else {
        createdetail();
        router.replace('/Homepage');
      }
    } catch (error) {
      setMessage("Register failed.");
    }

    setLoading(false);
  };

  return (

    <BackgroundWrapper>
       <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Image
                source={require('../assets/images/airplane.png')} // replace with your actual path
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.titleapp}>TravelUp</Text>
            </View>
    <View style={styles.overlay}>
      <Text style={styles.title}>Register</Text>

      <Text style={styles.label}>Username</Text>
      <Controller
        control={control}
        name="username"
        rules={{ required: 'Username is mandatory!' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter username..."
            placeholderTextColor={'#666'}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is mandatory!' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter email..."
            placeholderTextColor={'#666'}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is mandatory!' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter password..."
            placeholderTextColor={'#666'}
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Text style={styles.label}>Select Role</Text>
      <Controller
        control={control}
        name="roleId"
        rules={{ required: 'Role selection is required!' }}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            style={styles.input}
            data={roles.map(role => ({ label: role.label, value: role.id }))}
            labelField="label"
            valueField="value"
            placeholder="Select role"
            value={value}
            onChange={item => onChange(item.value)}
          />
        )}
      />
      {errors.roleId && <Text style={styles.error}>{errors.roleId.message}</Text>}

      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.error}>{message}</Text> : null}
    </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 24,
    borderRadius: 12,
    margin: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  titleapp: {
    fontSize: 54,
    fontWeight: '900',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  logo: {
    width: 100, // or whatever fits your design
    height: 100,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#2F70E2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
