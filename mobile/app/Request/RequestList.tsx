import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
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
  const { authChanged } = useAuth();
  const router = useRouter();
 
  useEffect(() => {
      LoadRequest();
    }, [authChanged]);
    
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
          Alert.alert('Error', 'Error Web Service');
        }
      })
      .catch(error => Alert.alert('Error', error.message));
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
          Alert.alert('Deleted', 'Request has been deleted.');
          LoadRequest();
        }
      })
      .catch(() => Alert.alert('Error', 'Error deleting request'));
  };

  const downloadApprovedRequests = async () => {
    const approved = dataRequest.filter(req => req.requeststatus.label === 'Approved');

    if (approved.length === 0) {
      Alert.alert('Info', 'No approved requests');
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
        <TouchableOpacity onPress={() =>  router.push({ pathname: '/Request/RequestEdit', params: { requestId: item.id },})}>
          <Text style={styles.link}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => OnDelete(item.id)}>
          <Text style={styles.link}>Delete</Text>
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
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Export PDF" onPress={exportApprovedRequestsPDF} />
        <Button title="Export Excel" onPress={downloadApprovedRequests} />
        <Button title="Add Request" onPress={() => router.push('/Request/RequestCreate')} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
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
    color: '#333',
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
    backgroundColor: '#1e1e1e',
    marginBottom: 8,
    borderRadius: 8,
  },
  cell: {
    color: '#fff',
    flex: 1,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  link: {
    color: '#00f',
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
    fontSize: 16,
  },  
});

export default RequestList;
