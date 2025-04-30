import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import authHeader from "../../utils/auth.header";

const baseUrl = "http://localhost:3000"; // Update for production use

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

    Promise.all([
      axios.get(quoteUrl, { headers: await authHeader() }),
      axios.get(hotelUrl, { headers: await authHeader() })
    ])
      .then(([quoteRes, hotelRes]) => {
        setFormHotel(quoteRes.data.data);
        setHotels(hotelRes.data.data || []);
      })
      .catch((error) => {
        Alert.alert("Error", "Server error: " + error.message);
      });
  };

  const onSubmit = async (data: QuoteHotel) => {
    const url = `${baseUrl}/quotehotel/update/${quotehotelId}`;
    const payload = {
      hotelId: data.hotelId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      pricePerNight: data.pricePerNight,
    };

    axios
      .put(url, payload, { headers: await authHeader() })
      .then((response) => {
        if (response.data.success) {
          Alert.alert("Success", response.data.message);
          handleClose();
          onRefresh();
        } else {
          Alert.alert("Error", response.data.message || "Update failed");
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Request failed");
      });
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
