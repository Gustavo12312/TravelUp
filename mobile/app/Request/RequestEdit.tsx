import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import authHeader from '../../utils/auth.header';
import { useAuth } from '@/utils/auth.context';
import JustificationAdd from '@/components/JustificationAdd';
import QuoteList from '@/components/QuoteList';
import QuoteAdd from '@/components/QuoteAdd';
import { url } from '@/components/Host';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const baseUrl = url;

const RequestEdit = () => {

  type Project = {
    id: number;
    name: string;
  };

  type City = {
    id: number;
    name: string;
  };

  const [code, setCode] = useState('');
  const [originCityId, setOriginCityId] = useState(0);
  const [destinationCityId, setDestinationCityId] = useState(0);
  const [Cities, setCities] = useState<City[]>([]);
  const [Projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(0);
  const [description, setDescription] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isHotelNeeded, setIsHotelNeeded] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [justification, setJustification] = useState('');
  const [requestStatusId, setRequestStatusId] = useState(0);
  const [lastStatusId, setLastStatusId] = useState(0);
  const [isEditMode, setIsEditMode] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showComments, setShowComments] = useState(false);


  const { requestId } = useLocalSearchParams();
  const requestIdNumber = Number(requestId);
  const router = useRouter();
  const { role, getRole } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const fetchDataOnFocus = async () => {
        await getRole();
        await fetchData();
      };
      fetchDataOnFocus();
    }, [requestId])
  );

  const fetchData = async () => {
    const headers = await authHeader();
    Promise.all([
      axios.get(`${baseUrl}/request/get/${requestIdNumber}`, { headers }),
      axios.get(`${baseUrl}/city/list`, { headers }),
      axios.get(`${baseUrl}/project/list`, { headers }),
    ])
      .then(([requestRes, cityRes, projectRes]) => {
        const data = requestRes.data.data;
        setCode(data.code);
        setOriginCityId(data.originCityId);
        setDestinationCityId(data.destinationCityId);
        setProjectId(data.projectId);
        setDescription(data.description);
        setIsRoundTrip(data.isRoundTrip);
        setTravelDate(data.travelDate);
        setReturnDate(data.returnDate);
        setIsHotelNeeded(data.isHotelNeeded);
        setCheckInDate(data.checkInDate);
        setCheckOutDate(data.checkOutDate);
        setRequestStatusId(data.requeststatus.id);
        setLastStatusId(data.requeststatus.id);
        setCities(cityRes.data.data);
        setProjects(projectRes.data.data);
        setJustification(data.justification);
      })
      .catch((error) => {
        Alert.alert('Error', 'Server Error: ' + error.message);
      });
  };

  useEffect(() => {
    if (requestStatusId !== lastStatusId) {
      sendUpdate1();
    }
    setLastStatusId(requestStatusId);
  }, [requestStatusId]);

  useEffect(() => {
    if (requestStatusId !== 3) {
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  }, [requestStatusId]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const sendUpdate1 = () => {
    if (validateForm()) {
      sendUpdate();
    }
  };

  const sendUpdate = async () => {
    const headers = await authHeader();
    axios.put(`${baseUrl}/request/update/${requestIdNumber}`, {
      requestStatusId,
      code,
      projectId,
      description,
      originCityId,
      destinationCityId,
      isRoundTrip,
      travelDate,
      returnDate,
      isHotelNeeded,
      checkInDate,
      checkOutDate,
    }, { headers })
      .then((res) => {
        if (res.data.success) {
          Alert.alert('Success', res.data.message);
          router.back();
        } else {
          Alert.alert('Error', res.data.message);
        }
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const sendUpdateRequest = async (newStatusId: number) => {
    const headers = await authHeader();
    axios.put(`${baseUrl}/request/update/${requestIdNumber}`, { requestStatusId: newStatusId }, { headers })
      .then((res) => {
        if (res.data.success) {
          Alert.alert('Success', res.data.message);
          router.back();
        } else {
          Alert.alert('Error', res.data.message);
        }
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  type FormErrors = {
    code?: string;
    projectId?: string;
    originCityId?: string;
    destinationCityId?: string;
    travelDate?: string;
    returnDate?: string;
    checkInDate?: string;
    checkOutDate?: string;
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!code.trim()) newErrors.code = "Code is required.";
    if (!projectId) newErrors.projectId = "Project is required.";
    if (!originCityId) newErrors.originCityId = "Origin City is required.";
    if (!destinationCityId) newErrors.destinationCityId = "Destination City is required.";
    if (!travelDate) newErrors.travelDate = "Travel Date is required.";
    if (isRoundTrip && !returnDate) newErrors.returnDate = "Return Date is required.";
    if (isHotelNeeded) {
      if (!checkInDate) newErrors.checkInDate = "Check-In Date is required.";
      if (!checkOutDate) newErrors.checkOutDate = "Check-Out Date is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const Submit = () => {
    if (validateForm()) {
      setRequestStatusId(4);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Code</Text>
        <TextInput
          style={[styles.input, errors.code && styles.errorInput]}
          value={code}
          editable={isEditMode}
          onChangeText={setCode}
          placeholder="Enter Code"
        />
        {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Project</Text>
        <Picker
          selectedValue={projectId}
          onValueChange={setProjectId}
          enabled={isEditMode}
          style={styles.input}
        >
          <Picker.Item label="Choose..." value="" />
          {Projects.map(project => (
            <Picker.Item key={project.id} label={project.name} value={project.id} />
          ))}
        </Picker>
        {errors.projectId && <Text style={styles.errorText}>{errors.projectId}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          editable={isEditMode}
          onChangeText={setDescription}
          placeholder="Enter Description"
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Origin City</Text>
        <Picker
          selectedValue={originCityId}
          onValueChange={setOriginCityId}
          enabled={isEditMode}
          style={styles.input}
        >
          <Picker.Item label="Choose..." value="" />
          {Cities.map(city => (
            <Picker.Item key={city.id} label={city.name} value={city.id} />
          ))}
        </Picker>
        {errors.originCityId && <Text style={styles.errorText}>{errors.originCityId}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Destination City</Text>
        <Picker
          selectedValue={destinationCityId}
          onValueChange={setDestinationCityId}
          enabled={isEditMode}
          style={styles.input}
        >
          <Picker.Item label="Choose..." value="" />
          {Cities.map(city => (
            <Picker.Item key={city.id} label={city.name} value={city.id} />
          ))}
        </Picker>
        {errors.destinationCityId && <Text style={styles.errorText}>{errors.destinationCityId}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Travel Date</Text>
        <TextInput
          style={[styles.input, errors.travelDate && styles.errorInput]}
          value={travelDate}
          editable={isEditMode}
          onChangeText={setTravelDate}
          placeholder="YYYY-MM-DD"
        />
        {errors.travelDate && <Text style={styles.errorText}>{errors.travelDate}</Text>}
      </View>

      <View style={styles.switchGroup}>
        <Text style={styles.label}>Is Round Trip?</Text>
        <Switch
          value={isRoundTrip}
          onValueChange={setIsRoundTrip}
          disabled={!isEditMode}
        />
      </View>

      {isRoundTrip && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Return Date</Text>
          <TextInput
            style={[styles.input, errors.returnDate && styles.errorInput]}
            value={returnDate}
            editable={isEditMode}
            onChangeText={setReturnDate}
            placeholder="YYYY-MM-DD"
          />
          {errors.returnDate && <Text style={styles.errorText}>{errors.returnDate}</Text>}
        </View>
      )}

      <View style={styles.switchGroup}>
        <Text style={styles.label}>Is Hotel Needed?</Text>
        <Switch
          value={isHotelNeeded}
          onValueChange={setIsHotelNeeded}
          disabled={!isEditMode}
        />
      </View>

      {isHotelNeeded && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-In Date</Text>
            <TextInput
              style={[styles.input, errors.checkInDate && styles.errorInput]}
              value={checkInDate}
              editable={isEditMode}
              onChangeText={setCheckInDate}
              placeholder="YYYY-MM-DD"
            />
            {errors.checkInDate && <Text style={styles.errorText}>{errors.checkInDate}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-Out Date</Text>
            <TextInput
              style={[styles.input, errors.checkOutDate && styles.errorInput]}
              value={checkOutDate}
              editable={isEditMode}
              onChangeText={setCheckOutDate}
              placeholder="YYYY-MM-DD"
            />
            {errors.checkOutDate && <Text style={styles.errorText}>{errors.checkOutDate}</Text>}
          </View>
        </>
      )}
      
      {/* Save Draft and Submit buttons */}
      {requestStatusId === 3 && (
        <View style={styles.buttonRow}>
          <Button title="Save Draft" color="skyblue" onPress={sendUpdate1} />
          <Button title="Submit" color="green" onPress={Submit} />
        </View>
      )}

      {/* Quoting and Approving logic below */}

      {requestStatusId === 7 && role === 2 && (
        <>
          <QuoteAdd onRefresh={handleRefresh} />
          <QuoteList refreshTrigger={refreshTrigger} oriId={originCityId} destId={destinationCityId} select={false} selected={false} disable={false} refreshstatus={function (): void {
            throw new Error('Function not implemented.');
          } } />
          <Button title="Finish Quoting" onPress={() => sendUpdateRequest(2)} />
        </>
      )}

      {requestStatusId === 6 && role === 3 && (
        <>
          <Button title="Reject" color="red" onPress={() => setShowAdd(true)} />
          {showAdd && <JustificationAdd requestId={requestIdNumber} show={showAdd} handleClose={() => setShowAdd(false)} onRefresh={fetchData} />}
          <Button title="Approve" color="green" onPress={() => sendUpdateRequest(5)} />
        </>
      )}

      {(requestStatusId === 1 || requestStatusId === 5 || requestStatusId === 6) && (
        <QuoteList refreshTrigger={refreshTrigger} select={false} selected={true} disable={true} refreshstatus={function (): void {
          throw new Error('Function not implemented.');
        } } oriId={0} destId={0} />
      )}

      {requestStatusId === 1 && justification !== "" && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.justificationTitle}>Justification:</Text>
          <Text style={styles.justificationText}>{justification}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RequestEdit;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#111' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { color: '#fff', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5 },
  errorInput: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', fontSize: 12 },
  backButton: { marginBottom: 10 },
  backButtonText: { color: '#00f', fontSize: 18 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  justificationTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  justificationText: { color: '#ccc', marginTop: 5 },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
});
