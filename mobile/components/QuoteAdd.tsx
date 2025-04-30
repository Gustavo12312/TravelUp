import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import authHeader from '../utils/auth.header';
import { url } from './Host';

const baseUrl = url;

const QuoteAdd = ({ onRefresh }: { onRefresh: () => void }) => {

    type Agency = {
        id: number;
        name: string;
      };

  const { requestId } = useLocalSearchParams();
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      agencyId: '',
    },
  });

  useEffect(() => {
      loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      const response = await axios.get(`${baseUrl}/agency/list`, { headers: await authHeader() });
      setAgencies(response.data.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      Alert.alert('Error', 'Error fetching agencies.');
    }
  };

  type QuoteFormData = {
    agencyId: string;
  };

  const onSubmit = async (data: QuoteFormData) => {
    try {
      const quoteData = {
        requestId: Number(requestId),
        agencyId: data.agencyId,
      };

      const response = await axios.post(`${baseUrl}/quote/create`, quoteData, { headers: await authHeader() });

      if (response.data.success) {
        Alert.alert('Success', 'Quote created successfully!');
        if (onRefresh) onRefresh();
        router.back();
      } else {
        Alert.alert('Error', response.data.message || 'Error creating quote.');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Error creating quote.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Quote</Text>

      <Controller
        control={control}
        name="agencyId"
        rules={{ required: 'Agency is required' }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Agency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Agency..." value="" />
                {agencies.map((agency) => (
                  <Picker.Item key={agency.id} label={agency.name} value={agency.id} />
                ))}
              </Picker>
            </View>
            {errors.agencyId && <Text style={styles.errorText}>{errors.agencyId.message}</Text>}
          </View>
        )}
      />

      <Button title="Add" onPress={handleSubmit(onSubmit)} color="#28a745" />
    </View>
  );
};

export default QuoteAdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // dark background
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#ffffff',
    height: 50,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
});
