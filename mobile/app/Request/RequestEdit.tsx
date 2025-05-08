import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch, FlatList } from 'react-native';
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
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import BackgroundWrapper from '@/components/BackgroundWrapper';

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


  const { requestId, page } = useLocalSearchParams();
  const requestIdNumber = Number(requestId);
  const router = useRouter();
  const { role, getRole, triggerHomeRefresh } = useAuth();

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
        Toast.show({
          type: 'error',
          text1: 'Server Error',
          text2: error.message
        });
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.data.message
        });
        goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        });
      }
    })
    .catch((error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message
      });
    });
    
  };

  const sendUpdateRequest = async (newStatusId: number) => {
    const headers = await authHeader();
    axios.put(`${baseUrl}/request/update/${requestIdNumber}`, { requestStatusId: newStatusId }, { headers })
    .then((res) => {
      if (res.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.data.message
        });  
        triggerHomeRefresh();    
        goBack;
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        });
      }
    })
    .catch((error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message
      });
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
  
  

  const Submit = () => {
    if (validateForm()) {
      setRequestStatusId(4);
    }
  };


    const goBack = () => {     
      if (page === 'RequestList') {               
        router.push('/Request/RequestList');
      } else {
        router.push('/Homepage');
      }
    };   

  return (
    <BackgroundWrapper>
      <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <>  
        <View style={styles.container}>   
          <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>      
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity> 
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            style={[styles.input, errors.code && styles.errorInput]}
            value={code}
            editable={isEditMode}
            onChangeText={setCode}
          />
          {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
        </View>
  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Project</Text>
          {!isEditMode ? (
          <TextInput
            style={[styles.input, { backgroundColor: '#f9f9f9' }]}
            value={Projects.find(project => project.id === projectId)?.name || ''}
            editable={false}
          />
        ) : (
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
        )}   
          {errors.projectId && <Text style={styles.errorText}>{errors.projectId}</Text>}
        </View>

        { description !== '' && (
          <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            editable={isEditMode}
            onChangeText={setDescription}
            multiline
          />
        </View>
        )}
        
  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Origin City</Text>
          {!isEditMode ? (
          <TextInput
            style={[styles.input, { backgroundColor: '#f9f9f9' }]}
            value={Cities.find(city => city.id === originCityId)?.name || ''}
            editable={false}
          />
        ) : (
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
        )}
          {errors.originCityId && <Text style={styles.errorText}>{errors.originCityId}</Text>}    
          </View>
  
        <View style={styles.inputGroup}>
        <Text style={styles.label}>Destination City</Text>
        {!isEditMode ? (
          <TextInput
            style={[styles.input, { backgroundColor: '#f9f9f9' }]} 
            value={Cities.find(city => city.id === destinationCityId)?.name || ''}
            editable={false}
          />
        ) : (
          <Dropdown
            style={[styles.dropdown, errors.destinationCityId && styles.errorInput]}
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
        )}
        {errors.destinationCityId && <Text style={styles.errorText}>{errors.destinationCityId}</Text>}
      </View>

  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Travel Date</Text>
          <TextInput
            style={[styles.input, errors.travelDate && styles.errorInput]}
            value={travelDate}
            editable={isEditMode}
            onChangeText={setTravelDate}    
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
              />
              {errors.checkOutDate && <Text style={styles.errorText}>{errors.checkOutDate}</Text>}
            </View>
          </>
        )}
        
        {/* Save Draft and Submit buttons */}
        {requestStatusId === 3 && (        
          <View>
            <TouchableOpacity style={styles.ButtonDraft} onPress={sendUpdate1}>
              <Text style={styles.ButtonText}> Save Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ButtonSubmit} onPress={Submit}>
              <Text style={styles.ButtonText}> Submit</Text>
            </TouchableOpacity>
          </View>
        )}
  
        {/* Quoting and Approving logic below */}
  
        {requestStatusId === 7 && role === 2 && (
          <>
            <QuoteAdd onRefresh={handleRefresh} />
            <QuoteList refreshTrigger={refreshTrigger} oriId={originCityId} destId={destinationCityId} select={false} selected={false} disable={false} refreshstatus={function (): void {
              throw new Error('Function not implemented.');
            } } />
            <TouchableOpacity style={styles.ButtonQuoting} onPress={() => sendUpdateRequest(2)}>
              <Text style={styles.ButtonText}>Finish Quoting</Text>
            </TouchableOpacity>
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
          <View style={styles.Card}>
            <Text style={styles.justificationTitle}>Justification</Text>
            <Text style={styles.justificationText}>{justification}</Text>
          </View>
        )}
      </View>  
      </>
      }
    />  
      </BackgroundWrapper>
  );
};

export default RequestEdit;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingBottom: 80},
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { color: '#000', marginBottom: 5, fontWeight: 'bold', fontSize: 16 },
  input: { backgroundColor: '#fff',  color: '#000', padding: 10, borderRadius: 5, fontSize: 16 },
  errorInput: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', fontSize: 12 },
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
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  justificationTitle: { color: '#000', fontSize: 24 },
  justificationText: { color: '#000', marginTop: 5 },
  Card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
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
  },
  ButtonSubmit: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  ButtonQuoting: {
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
