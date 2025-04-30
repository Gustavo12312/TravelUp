import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useAuth } from '../utils/auth.context'; // 👈 Use context


type FormData = {
    email: string;
    password: string;
  };

export default function LoginComponent() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
          email: '',
          password: '',
        },
      });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage('');
    try {
      const { email, password } = data;
      const res = await login(email, password);

      if (!res) {
        setMessage('Authentication failed.');
      } else {
        router.replace('/Homepage');
      }
    } catch (err) {
      setMessage('Authentication failed.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Please Fill Email!' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{String(errors.email.message)}</Text>}

      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Please Fill Password!' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{String(errors.password.message)}</Text>}

      <View style={styles.buttonContainer}>
        <Button title={loading ? "Logging in..." : "Login"} onPress={handleSubmit(onSubmit)} />
      </View>

      {message ? <Text style={styles.error}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 32,
      marginBottom: 24,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    label: {
      marginBottom: 6,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: '#aaa',
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
    },
    buttonContainer: {
      marginTop: 12,
    },
    link: {
      marginTop: 12,
      color: '#007AFF',
      textAlign: 'center',
    },
    error: {
      color: 'red',
      marginBottom: 10,
      fontSize: 14,
    },
  });
  
