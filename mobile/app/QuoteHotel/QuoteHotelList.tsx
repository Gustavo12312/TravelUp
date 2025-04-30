import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, Button, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import authHeader from '../../utils/auth.header';
import QuoteHotelAdd from './QuoteHotelAdd';
import QuoteHotelEdit from './QuoteHotelEdit';

const baseUrl = 'http://localhost:3000';

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
    axios
      .get(url, { headers: await authHeader() })
      .then((res) => {
        if (res.data.success) {
          setDataHotel(res.data.data);
        } else {
          Alert.alert('Error', 'Could not load hotels');
        }
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this hotel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => SendDelete(id) },
      ]
    );
  };

  const SendDelete = async (id: number) => {
    const url = `${baseUrl}/quotehotel/delete/${id}`;
    axios
      .delete(url, { headers: await authHeader() })
      .then((response) => {
        if (response.data.success) {
          Alert.alert('Deleted', 'Hotel has been deleted');
          LoadHotel();
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Error deleting hotel');
      });
  };

  const renderHotelItem = ({ item }: { item: HotelData}) => (
    <View style={styles.card}>
      <Text style={styles.hotel}>Hotel: {item.hotel.name}</Text>
      <Text>CheckIn Date: {format(new Date(item.checkInDate), 'dd/MM/yyyy')}</Text>
      <Text>CheckOut Date: {format(new Date(item.checkOutDate), 'dd/MM/yyyy')}</Text>
      <Text>Price Per Night: {item.pricePerNight} €</Text>
      {!disable && (
        <View style={styles.actions}>
          <Button title="Edit" onPress={() => setEditingHotelId(item.id)} />
          <Button title="Delete" color="red" onPress={() => confirmDelete(item.id)} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hotels List</Text>
        {!disable && (
          <Button title="Add Hotel" onPress={() => setShowAdd(true)} />
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
  container: { padding: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  row: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10 },
  card: { padding: 16, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8, elevation: 2 },
  cell: { marginBottom: 5 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  hotel: { fontWeight: "bold", marginBottom: 6 },
});
