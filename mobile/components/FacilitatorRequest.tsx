import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from 'expo-router';
import authHeader from "../utils/auth.header";
import { url } from "./Host";
import Toast from "react-native-toast-message";

const baseUrl = url;

type Props = {
  status: number;
  refreshTrigger: any;
  onRefresh: () => void;
};

type RequestData = {
  id: string;
  code: string;
  user: { name: string };
  project: { name: string };
  travelDate: string;
  returnDate?: string;
  requeststatus: { label: string };
};

export default function RequestFacilitator({ status, refreshTrigger, onRefresh }: Props) {
  const [dataRequest, setDataRequest] = useState<RequestData[]>([]);
  const router = useRouter();



  useEffect(() => {
    LoadRequest();
  }, [refreshTrigger, status]);

  const LoadRequest = async () => {
    const headers = await authHeader();
    const url =
      status === 0
        ? `${baseUrl}/request/get/status/4`
        : `${baseUrl}/request/get/status/7`;

    axios
      .get(url, { headers})
      .then((res) => {
        if (res.data.success) {
          setDataRequest(res.data.data);
        } else {
          Toast.show({type: "error", text1: "Error", text2: "Error Web Service"});
          
        }
      })
      .catch((error) => {
         Toast.show({type: "error", text1: "Error", text2: error.message});
      });
  };

  const SendUpdate = async (requestId: string, requestStatusId: number) => {
    const url = `${baseUrl}/request/update/${requestId}`;
    const datapost = { requestStatusId };
    const headers = await authHeader();

    axios
      .put(url, datapost, { headers })
      .then((res) => {
        if (res.data.success) {    
           Toast.show({type: "success", text1: "Sucess", text2: res.data.message});
          onRefresh();
        } else {      
          Toast.show({type: "error", text1: "Error", text2: res.data.message|| "Update failed"});
        }
      })
      .catch((error) => {        
        Toast.show({type: "error", text1: "Error", text2: error.message});
      });
  };

  const renderItem = ({ item }: { item: RequestData }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: '/Request/RequestEdit',
          params: { requestId: item.id },
        })
      }
    >
      <Text style={styles.code}>Code: {item.code}</Text>
      <Text>Requested By: {item.user.name}</Text>
      <Text>Project: {item.project.name}</Text>
      <Text>Travel: {format(new Date(item.travelDate), "dd/MM/yyyy")}</Text>
      {item.returnDate && (
        <Text>Return: {format(new Date(item.returnDate), "dd/MM/yyyy")}</Text>
      )}
      <Text>Status: {item.requeststatus.label}</Text>

      {status === 0 && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => SendUpdate(item.id, 7)}
        >
          <Text style={styles.actionText}>Approve & Send</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {status === 0 ? "New Requests" : "Pending Requests"}
      </Text>

      {dataRequest.length > 0 ? (
        <FlatList
          data={dataRequest}
          keyExtractor={(item) => item.id}
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
    fontWeight: "600",
    marginBottom: 12,
  },
  itemContainer: {
    backgroundColor: "#f4f4f4",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  code: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
