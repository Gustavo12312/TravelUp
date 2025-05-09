import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useAuth } from '../utils/auth.context';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Image } from 'react-native';


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
     <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
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
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: 'Please Fill Email!' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
              placeholder="Enter your email..."
              placeholderTextColor={'#666'}
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
              style={[styles.input, errors.password && styles.errorInput]}
              placeholder="Enter your password..."
              placeholderTextColor={'#666'}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{String(errors.password.message)}</Text>}

        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/register')}>
                <Text style={styles.link}> Don´t have an account? Register</Text>
              </TouchableOpacity>

        {message ? <Text style={styles.error}>{message}</Text> : null}
      </View>
      </BackgroundWrapper>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 24,
    borderRadius: 12,
    margin: 20,
  },
  link: {
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
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
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  titleapp: {
    fontSize: 54, // Bigger font size for logo feel
    fontWeight: '900',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
    letterSpacing: 2, // Adds spacing between letters
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
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 12,
    backgroundColor: '#5FABE6',
    borderRadius: 12,    
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
});
