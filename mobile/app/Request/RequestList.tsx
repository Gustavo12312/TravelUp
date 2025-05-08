import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter,  useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import * as Print from 'expo-print';
import { url } from '@/components/Host';
import authHeader from '../../utils/auth.header';
import { getUserid, getUserRole } from '../../utils/auth.utils';
import { useAuth } from '../../utils/auth.context';
import Toast from 'react-native-toast-message';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { MaterialIcons } from '@expo/vector-icons';

const baseUrl = url;

type RequestData = {
    id: number;
    code: string;
    user: { name: string };
    project: { name: string };
    travelDate: string;
    returnDate?: string;
    requeststatus: { label: string };
  };

  const RequestList = () => {
  const [dataRequest, setDataRequest] = useState<RequestData[]>([]);
  const { authChanged, triggerHomeRefresh } = useAuth();
  const router = useRouter();
  const { refresh } = useLocalSearchParams();
 
  useEffect(() => {
      LoadRequest();    
    }, [authChanged, refresh]);

    
  const LoadRequest = async () => {
    const Role = await getUserRole();
    const userid = await getUserid();
    const headers = await authHeader();
    let url;

  if (Role===3){
      url = baseUrl + "/request/list";
  }else {
      url = baseUrl + "/request/get/user/" + userid;
  }

    axios.get(url, { headers })
      .then(res => {
        if (res.data.success) {
          setDataRequest(res.data.data);
        } else {
          Toast.show({type: "error", text1: "Error", text2: "Error Web Service"});
        }
      })
      .catch(error => Toast.show({type: "error", text1: "Error", text2: error.message}));
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
    const url = `${baseUrl}/request/delete/${id}`;
    const headers = await authHeader();

    axios.delete(url, { headers })
      .then(response => {
        if (response.data.success) {
          Toast.show({type: "error", text1: "Deleted", text2: "Request has been deleted."});
          LoadRequest();   
          triggerHomeRefresh();          
        }
      })
      .catch(() => Toast.show({type: "error", text1: "Error", text2: "Error deleting request"}) );
  };

  const downloadApprovedRequests = async () => {
    const approved = dataRequest.filter(req => req.requeststatus.label === 'Approved');

    if (approved.length === 0) {
      Toast.show({type: "info", text1: "Info", text2: "No approved requests"});
      return;
    }

    const exportData = approved.map((req) => ({
      Code: req.code,
      User: req.user.name,
      Project: req.project.name,
      TravelDate: format(new Date(req.travelDate), 'dd/MM/yyyy'),
      ReturnDate: req.returnDate ? format(new Date(req.returnDate), 'dd/MM/yyyy') : '',
      Status: req.requeststatus.label,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Approved Requests');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileUri = FileSystem.cacheDirectory + 'Approved_Requests.xlsx';
    await FileSystem.writeAsStringAsync(fileUri, excelBuffer.toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri);
  };

  const exportApprovedRequestsPDF = async () => {
    const approved = dataRequest.filter(req => req.requeststatus.label === 'Approved');
    const htmlContent = `
      <html>
        <body>
          <h1>Approved Requests</h1>
          <table border="1">
            <tr>
              <th>Code</th>
              <th>User</th>
              <th>Project</th>
              <th>TravelDate</th>
              <th>ReturnDate</th>
              <th>Status</th>
            </tr>
            ${approved.map(req => `
              <tr>
                <td>${req.code}</td>
                <td>${req.user.name}</td>
                <td>${req.project.name}</td>
                <td>${format(new Date(req.travelDate), 'dd/MM/yyyy')}</td>
                <td>${req.returnDate ? format(new Date(req.returnDate), 'dd/MM/yyyy') : ''}</td>
                <td>${req.requeststatus.label}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  };

  const renderItem = ({ item } : {item: RequestData}) => (
    <View style={styles.row}>      
      <Text style={styles.cell}>{item.user.name}</Text>
      <Text style={styles.cell}>{format(new Date(item.travelDate), 'dd/MM/yyyy')}</Text>     
      <Text style={styles.cell}>{item.requeststatus.label}</Text>
      <View style={[styles.cell, styles.actionsCell]}>
        <TouchableOpacity onPress={() =>  router.push({ pathname: '/Request/RequestEdit', params: { requestId: item.id, page: 'RequestList' },})}>
          <MaterialIcons name="edit" size={24} color="#2F70E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => OnDelete(item.id)}>
          <MaterialIcons name="delete" size={28} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const TableHeader = () => (
    <View style={[styles.row, styles.header]}>
      <Text style={[styles.cell, styles.headerText]}>User</Text>
      <Text style={[styles.cell, styles.headerText]}>Travel Date</Text>
      <Text style={[styles.cell, styles.headerText]}>Status</Text>
      <Text style={[styles.cell, styles.headerText]}>Actions</Text>
    </View>
  );

  return (
    <BackgroundWrapper>
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.Button} onPress={exportApprovedRequestsPDF}>
          <Text style={styles.ButtonText}> Export PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={downloadApprovedRequests}>
          <Text style={styles.ButtonText}> Export Excel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => router.push('/Request/RequestAdd')}>
          <Text style={styles.ButtonText}> Add Request</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataRequest}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={TableHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No requests available.</Text>}
      />
    </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  header: {
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F7F0D3',
    marginBottom: 8,
    borderRadius: 8,
  },
  cell: {
    color: '#000',
    flex: 1,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
  Button: {
    backgroundColor: '#2F70E2',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  ButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});

export default RequestList;
