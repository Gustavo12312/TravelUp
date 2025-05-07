import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import axios from "axios";
import { format } from "date-fns";
import authHeader from "../../utils/auth.header";
import FlightAdd from "./FlightAdd";
import FlightEdit from "./FlightEdit";
import { url } from "@/components/Host";
import Toast from "react-native-toast-message";
import { MaterialIcons } from '@expo/vector-icons';

const baseUrl = url;

interface FlightListProps {
  quoteId: number;
  disable: boolean;
  onTotalChange: (total: number) => void;
  oriId: number;
  destId: number;
}

const FlightList: React.FC<FlightListProps> = ({ quoteId, disable, onTotalChange, oriId, destId }) => {
  const [dataFlight, setDataFlight] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState<number | null>(null);

  useEffect(() => {
    LoadFlight();
  }, [quoteId]);

  useEffect(() => {
    const total = dataFlight.reduce((acc, f) => acc + (f.price || 0), 0);
    onTotalChange?.(total);
  }, [dataFlight]);

  const LoadFlight = async () => {
    try {
      const res = await axios.get(`${baseUrl}/flight/getby/${quoteId}`, { headers: await authHeader() });
      if (res.data.success) {
        setDataFlight(res.data.data);
      } else {
        Toast.show({
          type: "error",
          text1: "Error loading flights",
          text2: "Web service returned an error",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Load Failed",
        text2: "Could not fetch flight data",
      });
    }
  };

  const OnDelete = async (id: number) => {
        if (Platform.OS === 'web') {
          const confirm = window.confirm("Are you sure you want to delete this Flight?");
          if (confirm) {
            await SendDelete(id);
          }
        } else {
          Alert.alert(
            'Are you sure?',
            'You will not be able to recover this Flight!',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => SendDelete(id) },
            ]
          );
        }
      };

  const SendDelete = async (id: number) => {
    try {
      const res = await axios.delete(`${baseUrl}/flight/delete/${id}`, {
        headers: await authHeader(),
      });
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: "Flight Deleted",
          text2: "The flight was successfully removed",
        });
        LoadFlight();
      } else {
        Toast.show({
          type: "error",
          text1: "Delete Failed",
          text2: res.data.message || "Could not delete flight",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Unable to delete flight",
      });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.flightNumber}>Flight: {item.flightNumber}</Text>
      <Text style={styles.text}>Departure: {item.DepartureAirport.name}</Text>
      <Text style={styles.text}>{format(new Date(item.departureDateTime), "dd/MM/yyyy HH:mm")}</Text>
      <Text style={styles.text}>Arrival: {item.ArrivalAirport.name}</Text>
      <Text style={styles.text}>{format(new Date(item.arrivalDateTime), "dd/MM/yyyy HH:mm")}</Text>
      <Text style={styles.text}>Price: {item.price} €</Text>

      {!disable && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnInfo} onPress={() => setEditingFlightId(item.id)}>
            <MaterialIcons name="edit" size={24} color="#2F70E2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={() => OnDelete(item.id)}>
            <MaterialIcons name="delete" size={26} color="#dc3545" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Flights List</Text>
        {!disable && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(true)}>
            <MaterialIcons name="add" size={26} color="#28a745" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={dataFlight}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No Flights Found</Text>}
      />

      {showAdd && (
        <FlightAdd
          quoteId={quoteId}
          show={showAdd}
          handleClose={() => setShowAdd(false)}
          onRefresh={LoadFlight}
          oriId={oriId}
          destId={destId}
        />
      )}

      {editingFlightId && (
        <FlightEdit
          flightId={editingFlightId}
          show={true}
          handleClose={() => setEditingFlightId(null)}
          onRefresh={LoadFlight}
          oriId={oriId}
          destId={destId}
        />
      )}
    </View>
  );
};

export default FlightList;

const styles = StyleSheet.create({
  container: { padding: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  text: { fontSize: 16, paddingVertical: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  addButton: { borderColor: '#28a745', borderWidth: 1, backgroundColor: "#fff", padding: 6, borderRadius: 6, alignItems: 'center', },
  btnText: { color: "#fff", fontWeight: "bold" },
  btnInfo: { borderColor: '#2F70E2' , borderWidth: 1, borderRadius: 6, padding: 6, alignItems: 'center', backgroundColor: '#fff' },  
  btnDelete: { borderColor: '#dc3545', borderWidth: 1, borderRadius: 6, padding: 6, alignItems: 'center', backgroundColor: '#fff' },  
  card: { paddingVertical: 12, paddingHorizontal: 26, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8, borderColor: '#000', borderWidth: 1, alignSelf: 'center' },
  flightNumber: { fontSize: 16, fontWeight: "bold", paddingVertical: 1 },
  actions: { flexDirection: "row", justifyContent: 'space-evenly', marginTop: 15 },
  empty: { textAlign: "center", marginTop: 30, color: "#555" }
});
