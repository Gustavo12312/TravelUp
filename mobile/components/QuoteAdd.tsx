import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import authHeader from '../utils/auth.header';
import { url } from './Host';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';

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
      Toast.show({type: "error", text1: "Error", text2: 'Error fetching agencies.'});
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
        Toast.show({type: "success", text1: "Success", text2: 'Quote created successfully!'});
        if (onRefresh) onRefresh();
      } else {        
        Toast.show({type: "error", text1: "Error", text2: response.data.message || 'Error creating quote.'});
      }
    } catch (error) {
      console.error('Error creating quote:', error);  
      Toast.show({type: "error", text1: "Error", text2: 'Error creating quote.'});
    }
  };

  return (
    <View style={styles.Card}>
      <Text style={styles.title}>Add Quote</Text>

      <Controller
        control={control}
        name="agencyId"
        rules={{ required: 'Agency is required' }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.formGroup}>            
            <View style={styles.Container}>
            <Dropdown
              style={[styles.dropdown, errors.agencyId && styles.errorInput]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.Text}
              itemTextStyle={styles.Text}
              data={agencies.map(agency => ({
                label: agency.name,
                value: agency.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select Agency"
              value={value}
              onChange={item => onChange(item.value)}
            />      
            </View>
            {errors.agencyId && <Text style={styles.errorText}>{errors.agencyId.message}</Text>}
          </View>
        )}
      />
       <TouchableOpacity style={styles.ButtonSubmit}  onPress={handleSubmit(onSubmit)}>
          <Text style={styles.ButtonText}>Add</Text>
        </TouchableOpacity>
    </View>
  );
};

export default QuoteAdd;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#000',
    textAlign: 'left',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  Card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    color: '#ffffff',
    marginBottom: 0,
  },
  Container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  errorInput: { borderColor: 'red', borderWidth: 1 },
  dropdown: { height: 40, borderRadius: 5, paddingHorizontal: 10, backgroundColor: '#fff' },
  dropdownContainer: { borderRadius: 8, backgroundColor: '#fff', },
  placeholder: { color: '#999', fontSize: 14, },
  Text: { color: '#000', fontSize: 14, },
  ButtonSubmit: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
   //alignSelf: 'center',
    //width: 100,
  },
  ButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },  

});
