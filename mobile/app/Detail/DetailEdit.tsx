import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity,ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { getUserid } from '../../utils/auth.utils';
import authHeader from '../../utils/auth.header';
import { url } from '@/components/Host';
import Toast from 'react-native-toast-message';
import BackgroundWrapper from '@/components/BackgroundWrapper';

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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message,
        });
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.message || 'Error updating details',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: String(error),
      });
    }
  };

  return (
    <BackgroundWrapper>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }} >
      
       <View style={styles.inputGroup}>
       <Text style={styles.photo}>Photo</Text>
      {currentPhoto ? (
        <Image
          source={{ uri: `${baseUrl}${currentPhoto}` }}
          style={styles.image}
        />
      ) : (
        <Text style={styles.noImageText}>No photo available</Text>
      )}
      </View>

      <View style={styles.inputGroup}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.ButtonText}>Pick a Photo</Text>
        </TouchableOpacity>
      </View>

       <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <Controller
          control={control}
          name="fullname"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Full Name..."
              placeholderTextColor='#888' 
              value={value ?? ''}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birthdate</Text>
        <Controller
          control={control}
          name="birthdate"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor='#888' 
              value={value ?? ''}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Phone..."
              placeholderTextColor='#888' 
              value={value ?? ''}
              onChangeText={onChange}
            />
          )}
        />
      </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Passport Number</Text>
          <Controller
            control={control}
            name="passportnumber"        
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Passport Number..."
                placeholderTextColor='#888' 
                value={value ?? ''}
                onChangeText={onChange}
              />
            )}
          />
        </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Emergency Contact</Text>
        <Controller
          control={control}
          name="emergencycontact"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact..."
              placeholderTextColor='#888' 
              value={value ?? ''}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Milescard</Text>
        <Controller
          control={control}
          name="milescard"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Milescard..."
              placeholderTextColor='#888' 
              value={value ?? ''}
              onChangeText={onChange}
            />
          )}
        />
      </View>     

      <TouchableOpacity style={styles.Button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.ButtonText}>Save</Text>
        </TouchableOpacity>

    </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,   
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: { backgroundColor: '#fff',  color: '#000', padding: 10, borderRadius: 5, fontSize: 16 },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  uploadButton: {
    backgroundColor: '#2F70E2',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',  
    marginBottom: 12,
    width: 150
  },
  Button: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center', 
    width: 80
  },
  ButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 8,
    margin: 10
  },
  noImageText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    marginBottom: 20,
  },
  label: { color: '#000', marginBottom: 5, fontWeight: 'bold', fontSize: 16 },
  photo: { color: '#000', marginBottom: 5, fontWeight: 'bold', fontSize: 16, alignSelf: 'center' },
  inputGroup: { marginBottom: 15 },
});
