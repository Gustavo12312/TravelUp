import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity,ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { getUserid } from '../../utils/auth.utils';
import authHeader from '../../utils/auth.header';
import { url } from '@/components/Host';

const baseUrl = url;

export default function DetailEdit() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<any>(null);

  const { control, handleSubmit, setValue } = useForm();
  
  useEffect(() => {
    const check = async () => {
      const currentuserId = await getUserid();
      if (!userId &&  userId !== currentuserId) {
        router.replace('/+not-found');
      } else {
        loadDetail();
      }
    };
    check();
  }, [userId]);

  const loadDetail = async () => {
    try {
      const urlGet = `${baseUrl}/detail/get/${userId}`;
      const headers = await authHeader();
      const res = await axios.get(urlGet, { headers });
      const data = res.data.data;
  
  
      setCurrentPhoto(data.photo || '');
  
      setValue('fullname', data.fullname || '');
      setValue('birthdate', data.birthdate || '');
      setValue('phone', data.phone || '');
      setValue('passportnumber', data.passportnumber || '');
      setValue('emergencycontact', data.emergencycontact || '');
      setValue('milescard', data.milescard || '');
  
    } catch (error) {
      Alert.alert('Error', 'Server error: ' + error);
    }
  };
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoFile(result.assets[0]);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const urlUpdate = `${baseUrl}/detail/update/${userId}`;
      const formData = new FormData();

      formData.append('fullname', data.fullname || '');
      formData.append('birthdate', data.birthdate || '');
      formData.append('phone', data.phone || '');
      formData.append('passportnumber', data.passportnumber || '');
      formData.append('emergencycontact', data.emergencycontact || '');
      formData.append('milescard', data.milescard || '');

      if (photoFile) {
        formData.append('photo', {
          uri: photoFile.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);
      } else if (currentPhoto) {
        formData.append('photo', currentPhoto);
      }

      const header = await authHeader();
      const response = await axios.put(urlUpdate, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...header,
        },
      });

      if (response.data.success === true) {
        Alert.alert('Success', response.data.message);
        router.back();
      } else {
        Alert.alert('Error', response.data.message || 'Error updating details');
      }
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  };

  return (
    <ScrollView style={styles.container}>

      <Controller
        control={control}
        name="fullname"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={value ?? ''}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="birthdate"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Birthdate (YYYY-MM-DD)"
            value={value ?? ''}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={value ?? ''}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="passportnumber"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Passport Number"
            value={value ?? ''}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="emergencycontact"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact"
            value={value ?? ''}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="milescard"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Milescard"
            value={value ?? ''}
            onChangeText={onChange}
          />
        )}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Pick a Photo</Text>
      </TouchableOpacity>

      {currentPhoto ? (
        <Image
          source={{ uri: `${baseUrl}${currentPhoto}` }}
          style={styles.image}
        />
      ) : (
        <Text style={styles.noImageText}>No photo available</Text>
      )}

      <Button title="Save" onPress={handleSubmit(onSubmit)} color="#28a745" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  noImageText: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 20,
  },
});
