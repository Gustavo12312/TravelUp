import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Toast from 'react-native-toast-message';
import authHeader from "../../utils/auth.header";
import { url } from "@/components/Host";

const baseUrl = url;

interface QuoteHotelEditProps {
  show: boolean;
  handleClose: () => void;
  quotehotelId: number;
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

const QuoteHotelEdit: React.FC<QuoteHotelEditProps> = ({ show, handleClose, quotehotelId, onRefresh, destId }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [formHotel, setFormHotel] = useState<QuoteHotel | null>(null);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<QuoteHotel>();

  useEffect(() => {
    loadHotel();
  }, [quotehotelId]);

  useEffect(() => {
    if (formHotel && hotels.length > 0) {
      setValue("hotelId", formHotel.hotelId);
      setValue("checkInDate", formHotel.checkInDate);
      setValue("checkOutDate", formHotel.checkOutDate);
      setValue("pricePerNight", formHotel.pricePerNight);
    }
  }, [formHotel, hotels]);

  const loadHotel = async () => {
    const quoteUrl = `${baseUrl}/quotehotel/get/${quotehotelId}`;
    const hotelUrl = `${baseUrl}/hotel/get/city/${destId}`;

    try {
      const [quoteRes, hotelRes] = await Promise.all([
        axios.get(quoteUrl, { headers: await authHeader() }),
        axios.get(hotelUrl, { headers: await authHeader() }),
      ]);

      setFormHotel(quoteRes.data.data);
      setHotels(hotelRes.data.data || []);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Error", text2: error.message || "Failed to load data." });
    }
  };

  const onSubmit = async (data: QuoteHotel) => {
    const url = `${baseUrl}/quotehotel/update/${quotehotelId}`;
    const payload = { ...data };

    try {
      const response = await axios.put(url, payload, { headers: await authHeader() });

      if (response.data.success) {
        Toast.show({ type: "success", text1: "Success", text2: response.data.message });
        handleClose();
        onRefresh();
      } else {
        Toast.show({ type: "error", text1: "Error", text2: response.data.message || "Update failed" });
      }
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Error", text2: error.message || "Request failed" });
    }
  };

  return (
    <Modal visible={show} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.title}>Edit Hotel</Text>

            <Text style={styles.label}>Hotel</Text>
            <Controller
              control={control}
              name="hotelId"
              rules={{ required: "Hotel is required" }}
              render={({ field: { onChange, value } }) => (
                <Picker selectedValue={value} onValueChange={onChange}>
                  <Picker.Item label="Choose..." value="" />
                  {hotels.map((hotel) => (
                    <Picker.Item key={hotel.id} label={hotel.name} value={hotel.id} />
                  ))}
                </Picker>
              )}
            />
            {errors.hotelId && <Text style={styles.error}>{errors.hotelId.message}</Text>}

            <Text style={styles.label}>Check-In Date</Text>
            <Controller
              control={control}
              name="checkInDate"
              rules={{ required: "Check-in date is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.checkInDate && <Text style={styles.error}>{errors.checkInDate.message}</Text>}

            <Text style={styles.label}>Check-Out Date</Text>
            <Controller
              control={control}
              name="checkOutDate"
              rules={{ required: "Check-out date is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.checkOutDate && <Text style={styles.error}>{errors.checkOutDate.message}</Text>}

            <Text style={styles.label}>Price Per Night (€)</Text>
            <Controller
              control={control}
              name="pricePerNight"
              rules={{
                required: "Price is required",
                min: { value: 1, message: "Price must be at least 1" },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="€..."
                  keyboardType="numeric"
                  value={value?.toString() || ""}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.pricePerNight && (
              <Text style={styles.error}>{errors.pricePerNight.message}</Text>
            )}

            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleSubmit(onSubmit)} />
              <View style={{ height: 10 }} />
              <Button title="Cancel" color="red" onPress={handleClose} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default QuoteHotelEdit;


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
