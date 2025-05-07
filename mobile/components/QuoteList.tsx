import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import authHeader from "../utils/auth.header";
import FlightList from "../app/QuoteFlight/FlightList";
import QuoteHotelList from "../app/QuoteHotel/QuoteHotelList";
import { url } from "./Host";
import Toast from "react-native-toast-message";
import { MaterialIcons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';


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
const [openQuoteIds, setOpenQuoteIds] = useState<number[]>([]);


  useEffect(() => {
    LoadQuote();
  }, [refreshTrigger, requestId]);

  const handleFlightTotalChange = (quoteId: number, total: number) => {
    setTotalFlightCost((prev) => ({ ...prev, [quoteId]: total }));
  };

  const handleHotelTotalChange = (quoteId: number, total: number) => {
    setTotalHotelCost((prev) => ({ ...prev, [quoteId]: total }));
  };

  const toggleAccordion = (quoteId: number) => {
    setOpenQuoteIds(prev =>
      prev.includes(quoteId)
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
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
        Toast.show({type: "error", text1: "Error", text2: "Error Web Service"});
        }
      })
      .catch((error) => Toast.show({type: "error", text1: "Error", text2: error.message}));
  };

  const SendUpdate =async (quoteId: number) => {
    const url = `${baseUrl}/quote/update/${quoteId}`;
    const datapost = { isSelected: true };

    axios.put(url, datapost, { headers: await authHeader() })
      .then((res) => {
        if (res.data.success) {         
          Toast.show({type: "success", text1: "Success", text2: res.data.message})
          refreshstatus?.();
        } else {          
          Toast.show({type: "error", text1: "Error", text2: res.data.message})
        }
      })
      .catch((err) => Toast.show({type: "error", text1: "Error", text2:  err.message}));
  };


  const OnDelete = async (id: number) => {
      if (Platform.OS === 'web') {
        const confirm = window.confirm("Are you sure you want to delete this request?");
        if (confirm) {
          await SendDelete(id);
        }
      } else {
        Alert.alert(
          'Are you sure?',
          'You will not be able to recover this request!',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => SendDelete(id) },
          ]
        );
      }
    };

  const SendDelete = async (id:number) => {
    axios.delete(`${baseUrl}/quote/delete/${id}`, { headers: await authHeader() })
      .then((res) => {
        if (res.data.success) {        
          Toast.show({type: "error", text1: "Deleted", text2: "Quote deleted."})
          LoadQuote();
        }
      })
      .catch(() => Toast.show({type: "error", text1: "Deleted", text2: "Error deleting quote"}));
  };

  interface Quote {
    id: number;
    agency: {
      name: string;
    };
  }

  const renderItem = ({ item }: { item: Quote }) => {
    if (!item || typeof item.id !== 'number') return null;
  
    const quoteCost = (totalFlightCost[item.id] || 0) + (totalHotelCost[item.id] || 0);
    const isOpen = openQuoteIds.includes(item.id);
  
    return (
      <View style={styles.container}>
       <TouchableOpacity onPress={() => toggleAccordion(item.id)} style={styles.accordionHeader}>
          <View style={styles.headerContent}>
          {!disable && (
              <TouchableOpacity onPress={() => OnDelete(item.id)} style={styles.deleteBtn}>
                <MaterialIcons name="delete" size={26} color="#dc3545" />
              </TouchableOpacity>
            )}
            <Text style={styles.agency}>Agency: {item.agency.name}</Text>            
            <View style={styles.rightSection}>
              <Text style={styles.cost}>€{quoteCost}</Text>              
              <MaterialIcons
                name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#333"
                style={styles.arrowIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

  
        <Collapsible collapsed={!isOpen}>
          {select && (
            <TouchableOpacity onPress={() => SendUpdate(item.id)} style={styles.selectBtn}>
              <Text style={styles.btnText}>Select</Text>
            </TouchableOpacity>
          )}
          
          <FlightList
            quoteId={item.id}
            disable={disable}
            onTotalChange={(t) => handleFlightTotalChange(item.id, t)}
            oriId={oriId}
            destId={destId}
          />
          <QuoteHotelList
            quoteId={item.id}
            disable={disable}
            onTotalChange={(t) => handleHotelTotalChange(item.id, t)}
            oriId={oriId}
            destId={destId}
          />
        </Collapsible>

      </View>
    );
  };
  

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{selected ? "Selected Quote" : "Quotes List"}</Text>
      <FlatList
        data={dataQuote}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No Quotes Found</Text>}
      />
    </View>
  );
};

export default QuoteList;

const styles = StyleSheet.create({
  container: { padding: 8,  },
  heading: { fontSize: 24, color: "#000", marginBottom: 16 },
  card: { backgroundColor: "#fff", padding: 16, marginBottom: 16, marginTop: 20, borderRadius: 8, elevation: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8},
  agency: { fontWeight: "bold", fontSize: 18 },
  cost: { color: "#333", fontWeight: "bold", fontSize: 18 },
  selectBtn: { backgroundColor: "#007bff", padding: 10, borderRadius: 6, marginVertical: 6 },
  deleteBtn: { borderColor: '#dc3545', margin: 5 , borderWidth: 1, borderRadius: 6, padding: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },  
  btnText: { color: "#fff", textAlign: "center" },
  empty: { textAlign: "center", marginTop: 30, color: "#555" },
  accordionHeader: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  arrowIcon: {
    marginLeft: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  
});
