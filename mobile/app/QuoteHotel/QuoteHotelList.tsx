import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import authHeader from '../../utils/auth.header';
import QuoteHotelAdd from './QuoteHotelAdd';
import QuoteHotelEdit from './QuoteHotelEdit';
import { url } from '@/components/Host';
import { MaterialIcons } from '@expo/vector-icons';

const baseUrl = url;

interface QuoteHotelListProps {
  quoteId: number;
  disable: boolean;
  oriId: number;
  destId: number;
  onTotalChange?: (total: number) => void;
}

interface HotelData {
  id: number;
  pricePerNight: number;
  checkInDate: string;
  checkOutDate: string;
  hotel: {
    name: string;
  };
}

const QuoteHotelList: React.FC<QuoteHotelListProps> = ({ quoteId, disable, onTotalChange, oriId, destId }) => {
  const [dataHotel, setDataHotel] = useState<HotelData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);

  useEffect(() => {
    LoadHotel();
  }, [quoteId]);

  useEffect(() => {
    const totalPrice = dataHotel.reduce((acc, hotel) => acc + (hotel.pricePerNight || 0), 0);
    if (onTotalChange) {
      onTotalChange(totalPrice);
    }
  }, [dataHotel]);

  const handleRefresh = () => {
    LoadHotel();
    setEditingHotelId(null);
  };

  const LoadHotel = async () => {
    const url = `${baseUrl}/quotehotel/getby/${quoteId}`;
    try {
      const res = await axios.get(url, { headers: await authHeader() });
      if (res.data.success) {
        setDataHotel(res.data.data);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load hotels' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Server error' });
    }
  };

 const OnDelete = async (id: number) => {
         if (Platform.OS === 'web') {
           const confirm = window.confirm("Are you sure you want to delete this Hotel");
           if (confirm) {
             await SendDelete(id);
           }
         } else {
           Alert.alert(
             'Are you sure?',
             'You will not be able to recover this Hotel!',
             [
               { text: 'Cancel', style: 'cancel' },
               { text: 'Delete', style: 'destructive', onPress: () => SendDelete(id) },
             ]
           );
         }
       };

  const SendDelete = async (id: number) => {
    const url = `${baseUrl}/quotehotel/delete/${id}`;
    try {
      const response = await axios.delete(url, { headers: await authHeader() });
      if (response.data.success) {
        Toast.show({ type: 'success', text1: 'Deleted', text2: 'Hotel has been deleted' });
        LoadHotel();
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: response.data.message || 'Delete failed' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Delete request failed' });
    }
  };

  const renderHotelItem = ({ item }: { item: HotelData }) => (
    <View style={styles.card}>
      <Text style={styles.hotel}>Hotel: {item.hotel.name}</Text>
      <Text style={styles.text}>CheckIn Date: {format(new Date(item.checkInDate), 'dd/MM/yyyy')}</Text>
      <Text style={styles.text}>CheckOut Date: {format(new Date(item.checkOutDate), 'dd/MM/yyyy')}</Text>
      <Text style={styles.text}>Price Per Night: {item.pricePerNight} €</Text>
      {!disable && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnInfo} onPress={() => setEditingHotelId(item.id)}>
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
        <Text style={styles.title}>Hotels List</Text>
        {!disable && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(true)}>
            <MaterialIcons name="add" size={26} color="#28a745" />
          </TouchableOpacity>
          )}
      </View>

      <FlatList
        data={dataHotel}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No Hotels Found</Text>}
        renderItem={renderHotelItem}
      />

      {showAdd && (
        <QuoteHotelAdd
          quoteId={quoteId}
          show={showAdd}
          handleClose={() => setShowAdd(false)}
          onRefresh={handleRefresh}
          destId={destId}
        />
      )}

      {editingHotelId !== null && (
        <QuoteHotelEdit
          quotehotelId={editingHotelId}
          show={true}
          handleClose={() => setEditingHotelId(null)}
          onRefresh={handleRefresh}
          destId={destId}
        />
      )}
    </View>
  );
};

export default QuoteHotelList;

const styles = StyleSheet.create({
  container: { padding: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  text: { fontSize: 16, paddingVertical: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  card: { paddingVertical: 12, paddingHorizontal: 26, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8, borderColor: '#000', borderWidth: 1, alignSelf: 'center' },
  actions: { flexDirection: "row", justifyContent: 'space-evenly', marginTop: 15 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  hotel: { fontSize: 16, fontWeight: "bold", paddingVertical: 1 },
  btnInfo: { borderColor: '#2F70E2' , borderWidth: 1, borderRadius: 6, padding: 6, alignItems: 'center', backgroundColor: '#fff' },  
  btnDelete: { borderColor: '#dc3545', borderWidth: 1, borderRadius: 6, padding: 6, alignItems: 'center', backgroundColor: '#fff' },  
  addButton: { borderColor: '#28a745', borderWidth: 1, backgroundColor: "#fff", padding: 6, borderRadius: 6, alignItems: 'center', },
});
