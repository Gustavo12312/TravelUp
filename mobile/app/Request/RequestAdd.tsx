import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Switch, StyleSheet, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import authHeader from '../../utils/auth.header';
import { useAuth } from '@/utils/auth.context';
import { router } from 'expo-router';
import { url } from '@/components/Host';
import Toast from 'react-native-toast-message';

const baseUrl = url ;

const RequestAdd = () => {
    const { authChanged, userId, getUserId } = useAuth();
      useEffect(() => {
        const fetchRole = async () => {
          await getUserId();
        };
        fetchRole();
      }, [authChanged]);

    type Project = {
        id: number;
        name: string;
      };
    
      type City = {
        id: number;
        name: string;
      };

  const [code, setCode] = useState("");
  const [originCityId, setOriginCityId] = useState("");
  const [destinationCityId, setDestinationCityId] = useState("");
  const [Cities, setCities] = useState<City[]>([]);
  const [Projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isHotelNeeded, setIsHotelNeeded] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});


  useEffect(() => {
    LoadData()
  }, []);

  const LoadData = async () =>{
    Promise.all([
        axios.get(baseUrl + "/city/list", { headers: await authHeader() }),
        axios.get(baseUrl + "/project/list", { headers: await authHeader() }),
      ])
        .then(([cityRes, projectRes]) => {
          setCities(cityRes.data.data);
          setProjects(projectRes.data.data);
        })
        .catch(error => console.error("Error fetching data:", error));

  }

  const handleSubmit = async (statusId: number) => {
    if (validateForm()) {
      const payload = {
        requestedBy: userId,
        requestStatusId: statusId,
        code,
        projectId,
        description,
        originCityId,
        destinationCityId,
        isRoundTrip,
        travelDate,
        returnDate: isRoundTrip ? returnDate : null,
        isHotelNeeded,
        checkInDate: isHotelNeeded ? checkInDate : null,
        checkOutDate: isHotelNeeded ? checkOutDate : null,
      };
  
      try {
        const response = await axios.post(baseUrl + "/request/create", payload, {
          headers: await authHeader(),
        });
  
        if (response.data.success) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: response.data.message || 'Request submitted successfully',
          });
          router.push("/Request/RequestList");
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response.data.message || 'Submission failed',
          });
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong',
        });
      }
    }
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


return (
  <FlatList
  data={[]}
  renderItem={() => null}
  ListHeaderComponent={
    <>
    <View style={styles.container}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Code</Text>
      <TextInput style={[styles.input, errors.code && styles.errorInput]} value={code} onChangeText={setCode} placeholder='Code...' />
      {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Project</Text>
      <Picker selectedValue={projectId} onValueChange={setProjectId} style={styles.input}>
        <Picker.Item label="Select project" value="" />
        {Projects.map(project => (
          <Picker.Item key={project.id} label={project.name} value={project.id} />
        ))}
      </Picker>
      {errors.projectId && <Text style={styles.errorText}>{errors.projectId}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Description</Text>
      <TextInput
        multiline
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder='Description...'
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Origin City</Text>
      <Picker selectedValue={originCityId} onValueChange={setOriginCityId} style={styles.input}>
        <Picker.Item label="Select origin" value="" />
        {Cities.map(city => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>
      {errors.originCityId && <Text style={styles.errorText}>{errors.originCityId}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Destination City</Text>
      <Picker selectedValue={destinationCityId} onValueChange={setDestinationCityId} style={styles.input}>
        <Picker.Item label="Select destination" value="" />
        {Cities.map(city => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>
      {errors.destinationCityId && <Text style={styles.errorText}>{errors.destinationCityId}</Text>}
    </View>

    <View style={styles.switchGroup}>
      <Text style={styles.label}>Is Round Trip</Text>
      <Switch value={isRoundTrip} onValueChange={setIsRoundTrip} />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Travel Date</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={[styles.input, errors.travelDate && styles.errorInput]}
        value={travelDate}
        onChangeText={setTravelDate}
      />
      {errors.travelDate && <Text style={styles.errorText}>{errors.travelDate}</Text>}
    </View>

    {isRoundTrip && (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Return Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={[styles.input, errors.returnDate && styles.errorInput]}
          value={returnDate}
          onChangeText={setReturnDate}
        />
        {errors.returnDate && <Text style={styles.errorText}>{errors.returnDate}</Text>}
      </View>
    )}

    <View style={styles.switchGroup}>
      <Text style={styles.label}>Is Hotel Needed</Text>
      <Switch value={isHotelNeeded} onValueChange={setIsHotelNeeded} />
    </View>

    {isHotelNeeded && (
      <>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-In Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            style={[styles.input, errors.checkInDate && styles.errorInput]}
            value={checkInDate}
            onChangeText={setCheckInDate}
          />
          {errors.checkInDate && <Text style={styles.errorText}>{errors.checkInDate}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-Out Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            style={[styles.input, errors.checkOutDate && styles.errorInput]}
            value={checkOutDate}
            onChangeText={setCheckOutDate}
          />
          {errors.checkOutDate && <Text style={styles.errorText}>{errors.checkOutDate}</Text>}
        </View>
      </>
    )}

    <View style={styles.buttonRow}>
      <Button title="Save Draft" color="#17a2b8" onPress={() => handleSubmit(3)} />
      <Button title="Submit" color="#28a745" onPress={() => handleSubmit(4)} />
    </View>
  </View>
    </>
  }
/>
  
    );
};
export default RequestAdd;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#111' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    inputGroup: { marginBottom: 15 },
    label: { color: '#fff', marginBottom: 5 },
    input: { backgroundColor: '#000', color: '#fff', padding: 10, borderRadius: 5 },
    errorInput: { borderColor: 'red', borderWidth: 1 },
    errorText: { color: 'red', fontSize: 12 },
    switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    buttonRow: { marginTop: 20, gap: 10 },
  });
