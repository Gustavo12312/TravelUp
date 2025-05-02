import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useAuth } from '../utils/auth.context'; // 👈 Use context
import { blue } from 'react-native-reanimated/lib/typescript/Colors';


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
    <ImageBackground
      source={require('../assets/images/plane.jpg')} // Replace with your image path
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)', // Darken for readability
    padding: 24,
    borderRadius: 12,
    margin: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
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
  buttonContainer: {
    marginTop: 12,
    backgroundColor: '#5FABE6',
    borderRadius: 12,
    width: 100,
    alignItems: 'center'
    
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});
