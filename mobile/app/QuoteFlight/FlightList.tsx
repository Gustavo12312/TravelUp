import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { format } from "date-fns";
import authHeader from "../../utils/auth.header";
import FlightAdd from "./FlightAdd";
import FlightEdit from "./FlightEdit";
import { url } from "@/components/Host";

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
        Alert.alert("Error", "Error Web Service");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load flights");
    }
  };

  const OnDelete = (id: number) => {
    Alert.alert(
      "Are you sure?",
      "You will not be able to recover this flight!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, delete it!",
          style: "destructive",
          onPress: () => SendDelete(id),
        },
      ]
    );
  };

  const SendDelete = async (id: number) => {
    try {
      const res = await axios.delete(`${baseUrl}/flight/delete/${id}`, {
        headers: await authHeader(),
      });
      if (res.data.success) {
        Alert.alert("Deleted", "Flight has been deleted.");
        LoadFlight();
      }
    } catch {
      Alert.alert("Error", "Error deleting flight");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.flightNumber}>Flight: {item.flightNumber}</Text>
      <Text>Departure: {item.DepartureAirport.name} - {format(new Date(item.departureDateTime), "dd/MM/yyyy HH:mm")}</Text>
      <Text>Arrival: {item.ArrivalAirport.name} - {format(new Date(item.arrivalDateTime), "dd/MM/yyyy HH:mm")}</Text>
      <Text>Price: {item.price} €</Text>

      {!disable && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnInfo} onPress={() => setEditingFlightId(item.id)}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDanger} onPress={() => OnDelete(item.id)}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Flights List</Text>
        {!disable && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(true)}>
            <Text style={styles.btnText}>+ Add Flight</Text>
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
  container: { padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  heading: { fontSize: 20, fontWeight: "bold" },
  addButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: { padding: 16, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8, elevation: 2 },
  flightNumber: { fontWeight: "bold", marginBottom: 6 },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  btnInfo: { backgroundColor: "#17a2b8", padding: 8, borderRadius: 6 },
  btnDanger: { backgroundColor: "#dc3545", padding: 8, borderRadius: 6 },
  empty: { textAlign: "center", marginTop: 30, color: "#999" }
});
