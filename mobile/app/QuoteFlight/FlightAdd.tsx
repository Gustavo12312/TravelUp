import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Modal, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { url } from "@/components/Host";
import Toast from "react-native-toast-message";

const baseUrl = url;

interface FlightAddProps {
    show: boolean;
    handleClose: () => void;
    quoteId: number;
    onRefresh: () => void;
    oriId: number;
    destId: number;
  }

const FlightAdd: React.FC<FlightAddProps> = ({ show, handleClose, quoteId, onRefresh, oriId, destId }) => {
  const [form, setForm] = useState({
    flightNumber: "",
    departureAirportId: "",
    arrivalAirportId: "",
    departureDateTime: new Date(),
    arrivalDateTime: new Date(),
    price: "",
    isReturnTrip: false,
    hasStops: false,
  });

  type Airport = {
    id: string;
    name: string;
    cityId: number;
  };

  const [allAirports, setAllAirports] = useState<Airport[]>([]);
  const [oriAirports, setOriAirports] = useState<Airport[]>([]);
  const [destAirports, setDestAirports] = useState<Airport[]>([]);

  useEffect(() => {
    // Fetch airport data
    const loadAirports = async () => {
      try {
        const [ori, dest, all] = await Promise.all([
          axios.get(`${baseUrl}/airport/get/city/${oriId}`),
          axios.get(`${baseUrl}/airport/get/city/${destId}`),
          axios.get(`${baseUrl}/airport/list`),
        ]);
        setOriAirports(ori.data.data);
        setDestAirports(dest.data.data);
        setAllAirports(all.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (show) loadAirports();
  }, [show]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${baseUrl}/flight/create`, {
        quoteId,
        ...form,
      });
      if (response.data.success) {
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: response.data.message,
              });
        handleClose();
        onRefresh();
      } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: response.data.message || 'Error updating details',
              });
            }
    } catch (err) {
      Toast.show({
              type: 'error',
              text1: 'Error',
              text2:"Could not submit form",
            });
    }
  };

  return (
    <Modal visible={show} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#000000aa", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 10 }}>
          <ScrollView>
            <Text>Flight Number</Text>
            <TextInput
              value={form.flightNumber}
              onChangeText={(text) => setForm({ ...form, flightNumber: text })}
              placeholder="Enter flight number"
              style={{ borderWidth: 1, marginBottom: 10 }}
            />

            <Text>Price (€)</Text>
            <TextInput
              keyboardType="numeric"
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })}
              style={{ borderWidth: 1, marginBottom: 10 }}
            />

            <Text>Departure Airport</Text>
            <Picker
              selectedValue={form.departureAirportId}
              onValueChange={(itemValue) => setForm({ ...form, departureAirportId: itemValue })}
            >
              <Picker.Item label="Choose..." value="" />
              {(form.hasStops ? allAirports : form.isReturnTrip ? destAirports : oriAirports).map((a) => (
                <Picker.Item key={a.id} label={a.name} value={a.id} />
              ))}
            </Picker>

            <Text>Arrival Airport</Text>
            <Picker
              selectedValue={form.arrivalAirportId}
              onValueChange={(itemValue) => setForm({ ...form, arrivalAirportId: itemValue })}
            >
              <Picker.Item label="Choose..." value="" />
              {(form.hasStops ? allAirports : form.isReturnTrip ? oriAirports : destAirports).map((a) => (
                <Picker.Item key={a.id} label={a.name} value={a.id} />
              ))}
            </Picker>

            <Text>Departure DateTime</Text>
            <DateTimePicker
              value={new Date(form.departureDateTime)}
              mode="datetime"
              display="default"
              onChange={(event, date) => date && setForm({ ...form, departureDateTime: date })}
            />

            <Text>Arrival DateTime</Text>
            <DateTimePicker
              value={new Date(form.arrivalDateTime)}
              mode="datetime"
              display="default"
              onChange={(event, date) => date && setForm({ ...form, arrivalDateTime: date })}
            />

            <Button title="Add Flight" onPress={handleSubmit} />
            <Button title="Cancel" color="gray" onPress={handleClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FlightAdd;
