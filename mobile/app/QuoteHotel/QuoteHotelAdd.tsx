import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import authHeader from "../../utils/auth.header";
import { url } from "@/components/Host";
import Toast from "react-native-toast-message";

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.title}>Add Hotel</Text>

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
                  keyboardType="numeric"
                  placeholder="€..."
                  value={value?.toString() || ""}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.pricePerNight && (
              <Text style={styles.error}>{errors.pricePerNight.message}</Text>
            )}

            <View style={styles.buttonContainer}>
              <Button title="Add Hotel" onPress={handleSubmit(onSubmit)} />
              <View style={{ height: 10 }} />
              <Button title="Cancel" onPress={handleClose} color="red" />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default QuoteHotelAdd;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
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
    fontWeight: "600",
    marginTop: 10,
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
