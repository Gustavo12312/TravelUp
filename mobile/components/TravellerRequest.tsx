import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from 'expo-router';
import authHeader from "../utils/auth.header";
import { getUserid } from "../utils/auth.utils";
import { url } from "./Host";
import { useAuth } from '../utils/auth.context';
import Toast from "react-native-toast-message/lib";

const baseUrl = url;

type Props = {
  status: number;
  refreshTrigger: any;
};

type RequestData = {
  id: number;
  code: string;
  user: { name: string };
  project: { name: string };
  travelDate: string;
  returnDate?: string;
  requeststatus: { label: string };
};

export default function RequestTraveller({ status, refreshTrigger }: Props) {
  const [dataRequest, setDataRequest] = useState<RequestData[]>([]);
  const router = useRouter();
  const { authChanged } = useAuth();

  useEffect(() => {
      LoadRequest();
  }, [status, authChanged, refreshTrigger]);

  const LoadRequest = async () => {
    const headers = await authHeader();
    const userid = await getUserid();
    const url =
      status === 0
        ? `${baseUrl}/request/list/open/${userid}`
        : `${baseUrl}/request/list/approved/${userid}`;

    axios
      .get(url, { headers })
      .then((res) => {
        if (res.data.success) {
          setDataRequest(res.data.data);
        } else {         
          Toast.show({type: "error", text1: "Error", text2: "Error fetching request data."})
        }
      })
      .catch((error) => {       
        Toast.show({type: "error", text1: "Error", text2: error.message})
      });
  };

  const renderItem = ({ item }: { item: RequestData }) => (
    <TouchableOpacity
    onPress={() =>
        router.push({
          pathname: '/Request/RequestEdit',
          params: { requestId: item.id },
        })
      } 
      style={styles.itemContainer}
    >
      <Text style={styles.itemText}>Code: {item.code}</Text>
      <Text style={styles.itemText}>Requested By: {item.user.name}</Text>
      <Text style={styles.itemText}>Project: {item.project.name}</Text>
      <Text style={styles.itemText}>Travel: {format(new Date(item.travelDate), "dd/MM/yyyy")}</Text>
      {item.returnDate && (
        <Text style={styles.itemText}>Return: {format(new Date(item.returnDate), "dd/MM/yyyy")}</Text>
      )}
      <Text style={styles.status}>{item.requeststatus.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{status === 0 ? "Open Requests" : "Next Trips"}</Text>
      {dataRequest.length > 0 ? (
        <FlatList
          data={dataRequest}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          nestedScrollEnabled={true}
        />
      ) : (
        <Text style={styles.empty}>No Request Found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    itemContainer: {
      backgroundColor: "#f4f4f4",
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
    },
    itemText: {
      fontSize: 16,
      marginBottom: 4,
    },
    status: {
      fontWeight: "bold",
      color: "#333",
      marginTop: 4,
    },
    empty: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "#555",
    },
  });
  