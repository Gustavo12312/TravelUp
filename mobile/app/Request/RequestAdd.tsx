import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Switch, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import authHeader from '../../utils/auth.header';
import { useAuth } from '@/utils/auth.context';
import { router } from 'expo-router';
import { url } from '@/components/Host';
import Toast from 'react-native-toast-message';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Dropdown } from 'react-native-element-dropdown';

const baseUrl = url ;

const RequestAdd = () => {
    const { authChanged, userId, getUserId, triggerHomeRefresh } = useAuth();

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
          resetForm();      
          router.push({ pathname: '/Request/RequestList', params: { refresh: Date.now().toString() },})
          triggerHomeRefresh();
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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize for comparison
  
    const dateformat = /^\d{4}-\d{2}-\d{2}$/;
  
    const isValidDate = (dateStr: string): boolean => {
      if (!dateformat.test(dateStr)) return false;
      const date = new Date(`${dateStr}T00:00:00`);
      return !isNaN(date.getTime());
    };
  
    const isFutureDate = (dateStr: string): boolean => {
      const date = new Date(`${dateStr}T00:00:00`);
      return date > today;
    };
  
    if (!code.trim()) newErrors.code = "Code is required.";
    if (!projectId) newErrors.projectId = "Project is required.";
    if (!originCityId) newErrors.originCityId = "Origin City is required.";
    if (!destinationCityId) newErrors.destinationCityId = "Destination City is required.";
  
    if (!travelDate) {
      newErrors.travelDate = "Travel Date is required.";
    } else if (!isValidDate(travelDate)) {
      newErrors.travelDate = "Use format YYYY-MM-DD.";
    } else if (!isFutureDate(travelDate)) {
      newErrors.travelDate = "Travel Date must be in the future.";
    }
  
    if (isRoundTrip) {
      if (!returnDate) {
        newErrors.returnDate = "Return Date is required.";
      } else if (!isValidDate(returnDate)) {
        newErrors.returnDate = "Use format YYYY-MM-DD.";
      } else if (!isFutureDate(returnDate)) {
        newErrors.returnDate = "Return Date must be in the future.";
      }
    }
  
    if (isHotelNeeded) {
      if (!checkInDate) {
        newErrors.checkInDate = "Check-In Date is required.";
      } else if (!isValidDate(checkInDate)) {
        newErrors.checkInDate = "Use format YYYY-MM-DD.";
      } else if (!isFutureDate(checkInDate)) {
        newErrors.checkInDate = "Check-In Date must be in the future.";
      }
  
      if (!checkOutDate) {
        newErrors.checkOutDate = "Check-Out Date is required.";
      } else if (!isValidDate(checkOutDate)) {
        newErrors.checkOutDate = "Use format YYYY-MM-DD.";
      } else if (!isFutureDate(checkOutDate)) {
        newErrors.checkOutDate = "Check-Out Date must be in the future.";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setCode("");
    setProjectId("");
    setDescription("");
    setOriginCityId("");
    setDestinationCityId("");
    setIsRoundTrip(false);
    setTravelDate("");
    setReturnDate("");
    setIsHotelNeeded(false);
    setCheckInDate("");
    setCheckOutDate("");
    setErrors({});
  };
  
  
return (    
    <BackgroundWrapper>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
    <TouchableOpacity style={styles.backButton} onPress={() =>  router.push("/Request/RequestList")}>
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Code</Text>
      <TextInput style={[styles.input, errors.code && styles.errorInput]} 
        value={code} 
        onChangeText={setCode} 
        placeholder='Code...' 
        placeholderTextColor='#888'
      />
      {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Project</Text>
      <Dropdown
        style={[styles.dropdown, errors.code && styles.errorInput]}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.Text}
        itemTextStyle={styles.Text}
        data={Projects.map(project => ({
          label: project.name,
          value: project.id,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select project"
        value={projectId}
        onChange={item => setProjectId(item.value)}
      />     
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
        placeholderTextColor='#888'
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Origin City</Text>
      <Dropdown
        style={[styles.dropdown, errors.code && styles.errorInput]}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.Text}
        itemTextStyle={styles.Text}
        data={Cities.map(city => ({
          label: city.name,
          value: city.id,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select Origin City"
        value={originCityId}
        onChange={item => setOriginCityId(item.value)}
      />
      {errors.originCityId && <Text style={styles.errorText}>{errors.originCityId}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Destination City</Text>
      <Dropdown
        style={[styles.dropdown, errors.code && styles.errorInput]}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.Text}
        itemTextStyle={styles.Text}
        data={Cities.map(city => ({
          label: city.name,
          value: city.id,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select Destination City"
        value={destinationCityId}
        onChange={item => setDestinationCityId(item.value)}
      />
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
        placeholderTextColor='#888'
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
          placeholderTextColor='#888'
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
            placeholderTextColor='#888'
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
            placeholderTextColor='#888'
            style={[styles.input, errors.checkOutDate && styles.errorInput]}
            value={checkOutDate}
            onChangeText={setCheckOutDate}
          />
          {errors.checkOutDate && <Text style={styles.errorText}>{errors.checkOutDate}</Text>}
        </View>
      </>
    )}

    <View style= { styles.buttonRow }>
        <TouchableOpacity style={styles.ButtonDraft} onPress={() => handleSubmit(3)}>
          <Text style={styles.ButtonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ButtonSubmit} onPress={() => handleSubmit(4)}>
          <Text style={styles.ButtonText}>Submit</Text>
        </TouchableOpacity>

    </View>
  </ScrollView>
  </BackgroundWrapper>
  );
};
export default RequestAdd;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    inputGroup: { marginBottom: 15 },
    label: { color: '#000', marginBottom: 5, fontWeight: 'bold', fontSize: 16 },
    input: { backgroundColor: '#fff', color: '#000', padding: 10, borderRadius: 5, fontSize: 16 },    
    errorInput: { borderColor: 'red', borderWidth: 1 },
    errorText: { color: 'red', fontSize: 12 },
    switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 15,
      alignSelf: 'flex-start',
      backgroundColor: '#2F70E2',
      borderRadius: 6,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    pickerItem: { color: '#000' },
    dropdown: { height: 40, borderRadius: 5, paddingHorizontal: 10, backgroundColor: '#fff' },
    dropdownContainer: { borderRadius: 8, backgroundColor: '#fff', },
    placeholder: { color: '#999', fontSize: 14, },
    Text: { color: '#000', fontSize: 14, },
    ButtonDraft: {
      backgroundColor: '#17a2b8',
      padding: 8,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 12,
      width: 120
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
    ButtonSubmit: {
      backgroundColor: '#28a745',
      padding: 8,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 12,
      width: 120
    },
    ButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },  
  });
