import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, Modal, Switch, StyleSheet, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import authHeader from "../../utils/auth.header";
import { url } from "@/components/Host";
import Toast from "react-native-toast-message";


const baseUrl = url;

interface FlightEditProps {
    show: boolean;
    handleClose: () => void;
    flightId: number;
    onRefresh: () => void;
    oriId: number;
    destId: number;
  }

  interface Flight {
    flightNumber: string,
    departureAirportId: number,
    arrivalAirportId: number,
    departureDateTime: string,
    arrivalDateTime: string,
    price: number,
    isReturnTrip: boolean,
    hasStops: boolean,
  }

  type Airport = {
    id: number;
    name: string;
    cityId: number;
  };

const FlightEdit: React.FC<FlightEditProps> = ({ show, handleClose, flightId, onRefresh, oriId, destId }) => {
  const [allairports, setAllAirports] = useState<Airport[]>([]);
  const [oriairports, setOriAirports] = useState<Airport[]>([]);
  const [destairports, setDestAirports] = useState<Airport[]>([]);
  const [formFlight, setFormFlight] = useState<Flight | null>(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());

  const { control, setValue,  watch, handleSubmit, reset, formState: { errors } } = useForm<Flight>();
  const isReturnTrip = watch("isReturnTrip");
  const hasStops = watch("hasStops");

  useEffect(() => {
    loadFlight();
  }, [flightId]);

  useEffect(() => {
    if (formFlight) {
      setValue("flightNumber", formFlight.flightNumber);
      setValue("departureAirportId", formFlight.departureAirportId);
      setValue("arrivalAirportId", formFlight.arrivalAirportId);
      setValue("price", formFlight.price);
      setValue("isReturnTrip", formFlight.isReturnTrip);
      setValue("hasStops", formFlight.hasStops);
      setDepartureDate(new Date(formFlight.departureDateTime));
      setArrivalDate(new Date(formFlight.arrivalDateTime));
    }
  }, [formFlight]);

  const loadFlight = async () => {
    Promise.all([
      axios.get(`${baseUrl}/flight/get/${flightId}`, { headers: await authHeader() }),
      axios.get(`${baseUrl}/airport/get/city/${oriId}`, { headers: await authHeader() }),
      axios.get(`${baseUrl}/airport/get/city/${destId}`, { headers: await authHeader() }),
      axios.get(`${baseUrl}/airport/list`, { headers: await authHeader() })
    ])
      .then(([flightRes, oriRes, destRes, allRes]) => {
        setFormFlight(flightRes.data.data);
        setOriAirports(oriRes.data.data);
        setDestAirports(destRes.data.data);
        setAllAirports(allRes.data.data);
      })
      .catch(err => Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "Could not load flight info",
              }));
  };

  const onSubmit = async (data: Flight) => {
    const payload = {
      flightNumber: data.flightNumber,
      departureAirportId: data.departureAirportId,
      arrivalAirportId: data.arrivalAirportId,
      departureDateTime: departureDate.toISOString(),
      arrivalDateTime: arrivalDate.toISOString(),
      price: data.price,
      isReturnTrip: data.isReturnTrip,
      hasStops: data.hasStops
    };

    axios
  .put(`${baseUrl}/flight/update/${flightId}`, payload, { headers: await authHeader() })
  .then(res => {
    if (res.data.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res.data.message,
      });
      handleClose();
      onRefresh();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: res.data.message || 'Flight update failed.',
      });
    }
  })
  .catch(() => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Request failed',
    });
  });

  };

  const filteredAirports = (type: "departure" | "arrival"): Airport[] => {
    if (hasStops) return allairports;
    if (isReturnTrip) return type === "departure" ? destairports : oriairports;
    return type === "departure" ? oriairports : destairports;
  };

  return (
    <Modal visible={show} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Flight</Text>

        <Controller
          control={control}
          name="isReturnTrip"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchRow}>
              <Text>Return Trip</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="hasStops"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchRow}>
              <Text>Has Stops</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

        <Text>Flight Number</Text>
        <Controller
          control={control}
          name="flightNumber"
          rules={{ required: "Flight number is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
          )}
        />
        {errors.flightNumber && <Text style={styles.error}>{errors.flightNumber.message}</Text>}

        <Text>Departure Airport</Text>
        <Controller
          control={control}
          name="departureAirportId"
          rules={{ required: "Required" }}
          render={({ field: { onChange, value } }) => (
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
              {filteredAirports("departure").map(airport => (
                <Picker.Item key={airport.id} label={airport.name} value={airport.id} />
              ))}
            </Picker>
          )}
        />

        <Text>Arrival Airport</Text>
        <Controller
          control={control}
          name="arrivalAirportId"
          rules={{ required: "Required" }}
          render={({ field: { onChange, value } }) => (
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
              {filteredAirports("arrival").map(airport => (
                <Picker.Item key={airport.id} label={airport.name} value={airport.id} />
              ))}
            </Picker>
          )}
        />

        <Text>Price (€)</Text>
        <Controller
          control={control}
          name="price"
          rules={{ required: "Required", min: { value: 1, message: "Minimum €1" } }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value?.toString() || ""}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}

        <Text>Departure Date</Text>
        <DateTimePicker
          value={departureDate}
          mode="datetime"
          display="default"
          onChange={(_, date) => date && setDepartureDate(date)}
        />

        <Text>Return Date</Text>
        <DateTimePicker
          value={arrivalDate}
          mode="datetime"
          display="default"
          onChange={(_, date) => date && setArrivalDate(date)}
        />

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        <Button title="Cancel" color="red" onPress={handleClose} />
      </View>
    </Modal>
  );
};

export default FlightEdit;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 10, borderRadius: 5 },
  picker: { height: 50, marginVertical: 10 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  error: { color: "red" }
});
