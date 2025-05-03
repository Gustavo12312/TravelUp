import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'expo-router';
import authHeader from '../utils/auth.header';
import { useAuth } from '../utils/auth.context';
import { Dropdown } from 'react-native-element-dropdown'; 
import { url } from '@/components/Host';

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
    <ImageBackground
          source={require('../assets/images/plane12.jpg')} // Replace with your image path
          style={styles.background}
          resizeMode="cover"
        >

        
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
    backgroundColor: '#5FABE6',
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
