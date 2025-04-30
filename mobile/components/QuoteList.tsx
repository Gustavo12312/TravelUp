import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import authHeader from "../utils/auth.header";
import FlightList from "../app/QuoteFlight/FlightList";
import QuoteHotelList from "../app/QuoteHotel/QuoteHotelList";
import { url } from "./Host";

const baseUrl = url;

interface QuoteListProps {
    refreshTrigger: number;
    select: boolean;
    selected: boolean;
    disable: boolean;
    refreshstatus: () => void;
    oriId: number;
    destId: number;
  }

const QuoteList: React.FC<QuoteListProps> = ({ refreshTrigger, select, selected, disable, refreshstatus, oriId, destId }) => {
const [dataQuote, setDataQuote] = useState([]);
const [totalFlightCost, setTotalFlightCost] = useState<{ [key: number]: number }>({});
const [totalHotelCost, setTotalHotelCost] = useState<{ [key: number]: number }>({});
const { requestId } = useLocalSearchParams();

  useEffect(() => {
    LoadQuote();
  }, [refreshTrigger, requestId]);

  const handleFlightTotalChange = (quoteId: number, total: number) => {
    setTotalFlightCost((prev) => ({ ...prev, [quoteId]: total }));
  };

  const handleHotelTotalChange = (quoteId: number, total: number) => {
    setTotalHotelCost((prev) => ({ ...prev, [quoteId]: total }));
  };

  const LoadQuote = async() => {
    const url = selected
      ? `${baseUrl}/quote/get/selected/${requestId}`
      : `${baseUrl}/quote/getby/${requestId}`;

    axios.get(url, { headers: await authHeader() })
      .then((res) => {
        if (res.data.success) {
          const quotes = selected ? [res.data.data] : res.data.data;
          setDataQuote(quotes);
        } else {
          Alert.alert("Error", "Error Web Service");
        }
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  const SendUpdate =async (quoteId: number) => {
    const url = `${baseUrl}/quote/update/${quoteId}`;
    const datapost = { isSelected: true };

    axios.put(url, datapost, { headers: await authHeader() })
      .then((res) => {
        if (res.data.success) {
          Alert.alert("Success", res.data.message);
          refreshstatus?.();
        } else {
          Alert.alert("Error", res.data.message);
        }
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  const OnDelete = (id : number) => {
    Alert.alert("Confirm", "Delete this quote?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => SendDelete(id) },
    ]);
  };

  const SendDelete = async (id:number) => {
    axios.delete(`${baseUrl}/quote/delete/${id}`, { headers: await authHeader() })
      .then((res) => {
        if (res.data.success) {
          Alert.alert("Deleted", "Quote deleted.");
          LoadQuote();
        }
      })
      .catch(() => Alert.alert("Error", "Error deleting quote"));
  };

  interface Quote {
    id: number;
    agency: {
      name: string;
    };
  }

  const renderItem = ({ item }: { item: Quote }) => {
    const quoteCost = (totalFlightCost[item.id] || 0) + (totalHotelCost[item.id] || 0);

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.agency}>Agency: {item.agency.name}</Text>
          <Text style={styles.cost}>Total Cost: €{quoteCost}</Text>
        </View>
        {select && (
          <TouchableOpacity onPress={() => SendUpdate(item.id)} style={styles.selectBtn}>
            <Text style={styles.btnText}>Select</Text>
          </TouchableOpacity>
        )}
        {!disable && (
          <TouchableOpacity onPress={() => OnDelete(item.id)} style={styles.deleteBtn}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        )}
        <FlightList quoteId={item.id} disable={disable} onTotalChange={(t) => handleFlightTotalChange(item.id, t)} oriId={oriId} destId={destId} />
        <QuoteHotelList quoteId={item.id} disable={disable} onTotalChange={(t) => handleHotelTotalChange(item.id, t)} oriId={oriId} destId={destId} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{selected ? "Selected Quote" : "Quotes List"}</Text>
      <FlatList
        data={dataQuote}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No Quotes Found</Text>}
      />
    </View>
  );
};

export default QuoteList;

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  card: { backgroundColor: "#fff", padding: 16, marginBottom: 12, borderRadius: 8, elevation: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  agency: { fontWeight: "bold" },
  cost: { color: "#333" },
  selectBtn: { backgroundColor: "#007bff", padding: 10, borderRadius: 6, marginVertical: 6 },
  deleteBtn: { backgroundColor: "#dc3545", padding: 10, borderRadius: 6, marginVertical: 6 },
  btnText: { color: "#fff", textAlign: "center" },
  empty: { textAlign: "center", marginTop: 30, color: "#999" }
});
