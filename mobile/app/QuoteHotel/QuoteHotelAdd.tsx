import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import authHeader from "../../utils/auth.header";
import { url } from "@/components/Host";
import Toast from "react-native-toast-message";
import { Dropdown } from 'react-native-element-dropdown';

const baseUrl = url; 

interface QuoteHotelAddProps {
  show: boolean;
  handleClose: () => void;
  quoteId: number;
  onRefresh: () => void;
  destId: number;
}

interface Hotel {
  id: number;
  name: string;
  cityId: number;
}

interface QuoteHotel {
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
  pricePerNight: number;
}

const QuoteHotelAdd: React.FC<QuoteHotelAddProps> = ({ show, handleClose, quoteId, onRefresh, destId }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<QuoteHotel>();

  useEffect(() => {
    loadHotel();
  }, []);

  useEffect(() => {
    if (!show) reset();
  }, [show]);

  const loadHotel = async () => {
    try {
      const res = await axios.get(`${baseUrl}/hotel/get/city/${destId}`, {
        headers: await authHeader(),
      });
      setHotels(res.data.data || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hotel Load Failed",
        text2: "Could not fetch hotel list",
      });
    }
  };

  const onSubmit = async (data: QuoteHotel) => {
    const payload = {
      quoteId,
      hotelId: data.hotelId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      pricePerNight: data.pricePerNight,
    };

    try {
      const res = await axios.post(`${baseUrl}/quotehotel/create`, payload, {
        headers: await authHeader(),
      });

      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: "Hotel Added",
          text2: res.data.message || "Hotel successfully added",
        });
        handleClose();
        onRefresh();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.data.message || "Error creating hotel",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Request Failed",
        text2: error.message || "Could not create hotel",
      });
    }
  };

  return (
    <Modal visible={show} animationType="slide" transparent={true}>
       <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}         
        >
      <View style={styles.modalOverlay}>
        <View style={styles.card}>          
            <Text style={styles.title}>Add Hotel</Text>

            <View style={styles.inputGroup}> 
              <Text style={styles.label}>Hotel</Text>
              <Controller
                control={control}
                name="hotelId"
                rules={{ required: "Hotel is required." }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    style={[styles.dropdown, errors.hotelId && styles.errorInput]}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.Text}
                    itemTextStyle={styles.Text}
                    data={hotels.map(hotel => ({
                      label: hotel.name,
                      value: hotel.id,
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Arrival Airport"                    
                    value={value || undefined}
                    onChange={item => onChange(item.value)}
                  />                   
                )}
              />
            {errors.hotelId && <Text style={styles.error}>{errors.hotelId.message}</Text>}
            </View>

            <View style={styles.inputGroup}> 
              <Text style={styles.label}>Check-In Date</Text>
              <Controller
                control={control}
                name="checkInDate"
                rules={{
                  required: "Check-In Date is required.",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Use format YYYY-MM-DD",
                  },
                  validate: (value: string) => {
                    const inputDate = new Date(`${value}T00:00:00`);
                    if (isNaN(inputDate.getTime())) {
                      return "Invalid date format.";
                    }
                    const today = new Date();
                    // Clear the time from today's date for accurate comparison
                    today.setHours(0, 0, 0, 0);
                    if (inputDate <= today) {
                      return "Check-In must be in the future.";
                    }
                    return true;
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput                    
                    style={[styles.input, errors.checkInDate && styles.errorInput]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor='#888' 
                    value={value || ''}
                    onChangeText={onChange}
                  />
                )}
              />
            {errors.checkInDate && <Text style={styles.error}>{errors.checkInDate.message}</Text>}
            </View>

            <View style={styles.inputGroup}> 
              <Text style={styles.label}>Check-Out Date</Text>
              <Controller
                control={control}
                name="checkOutDate"
                rules={{
                  required: "Check-Out Date is required.",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Use format YYYY-MM-DD",
                  },
                  validate: (value: string) => {
                    const inputDate = new Date(`${value}T00:00:00`);
                    if (isNaN(inputDate.getTime())) {
                      return "Invalid date format.";
                    }
                    const today = new Date();
                    // Clear the time from today's date for accurate comparison
                    today.setHours(0, 0, 0, 0);
                    if (inputDate <= today) {
                      return "Check-Out must be in the future.";
                    }
                    return true;
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput                    
                    style={[styles.input, errors.checkOutDate && styles.errorInput]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor='#888' 
                    value={value || ''}
                    onChangeText={onChange}
                  />
                )}
              />
            {errors.checkOutDate && <Text style={styles.error}>{errors.checkOutDate.message}</Text>}
            </View>

            <View style={styles.inputGroup}> 
              <Text style={styles.label}>Price Per Night (€)</Text>
              <Controller
                control={control}
                name="pricePerNight"
                rules={{
                  required: "Price is required.",
                  min: { value: 1, message: "Price must be at least 1" },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                  style={[styles.input, errors.pricePerNight && styles.errorInput]}
                    keyboardType="numeric"
                    placeholder="Price..."
                    placeholderTextColor='#888' 
                    value={value?.toString() || ""}
                    onChangeText={onChange}
                  />
                )}
              />
            {errors.pricePerNight && (
              <Text style={styles.error}>{errors.pricePerNight.message}</Text>
            )}
            </View>           

            <View style={styles.buttonRow}>            
            <TouchableOpacity style={styles.Cancelbtn} onPress={handleClose}>
              <Text style={styles.ButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Addbtn} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.ButtonText}>Add</Text>
            </TouchableOpacity>
            </View>      
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default QuoteHotelAdd;

const styles = StyleSheet.create({
  card:{ backgroundColor: '#fff', margin: 40, padding: 20, borderRadius: 8 },
  input: { backgroundColor: '#fff', color: '#000', padding: 10, borderRadius: 5, fontSize: 16, borderWidth: 1, borderColor: '#000' },  
  label: { color: '#000', marginBottom: 5, fontWeight: 'bold', fontSize: 16 },  
  inputGroup: { marginBottom: 15 },
  dropdown: { height: 40, borderRadius: 5, paddingHorizontal: 10, backgroundColor: '#fff',  borderWidth: 1, borderColor: '#000'  },
  dropdownContainer: { borderRadius: 8, backgroundColor: '#fff', },
  placeholder: { color: '#999', fontSize: 14, },
  Text: { color: '#000', fontSize: 14, },
  Addbtn: { backgroundColor: '#28a745', padding: 8, borderRadius: 10, alignItems: 'center', marginTop: 12, width: 80 },
  Cancelbtn: { backgroundColor: 'grey', padding: 8, borderRadius: 10, alignItems: 'center', marginTop: 12, width: 80 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
  ButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', },  
  error: { color: "red", fontSize: 12, },
  errorInput: { borderColor: 'red', borderWidth: 1 },
  modalOverlay: { flexGrow: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", },
  title: { fontSize: 24, color: '#000', marginBottom: 20 },
});
