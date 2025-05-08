import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, Modal, Switch, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import authHeader from "../../utils/auth.header";
import { url } from "@/components/Host";
import Toast from "react-native-toast-message";
import { Dropdown } from "react-native-element-dropdown";


const baseUrl = url;

interface FlightEditProps {
    show: boolean;
    handleClose: () => void;
    flightId: number;
    onRefresh: () => void;
    oriId: number;
    destId: number;
  }

  interface Flight {
    flightNumber: string,
    departureAirportId: number,
    arrivalAirportId: number,
    departureDateTime: string,
    arrivalDateTime: string,
    price: number,
    isReturnTrip: boolean,
    hasStops: boolean,
  }

  type Airport = {
    id: number;
    name: string;
    cityId: number;
  };

const FlightEdit: React.FC<FlightEditProps> = ({ show, handleClose, flightId, onRefresh, oriId, destId }) => {
  const [allAirports, setAllAirports] = useState<Airport[]>([]);
  const [oriAirports, setOriAirports] = useState<Airport[]>([]);
  const [destAirports, setDestAirports] = useState<Airport[]>([]);
  const [formFlight, setFormFlight] = useState<Flight | null>(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());

  const { control, setValue,  watch, handleSubmit, reset, formState: { errors } } = useForm<Flight>();
  const isReturnTrip = watch("isReturnTrip");
  const hasStops = watch("hasStops");

  useEffect(() => {
    loadFlight();
  }, [flightId]);

  useEffect(() => {
    if (formFlight) {
      setValue("flightNumber", formFlight.flightNumber);
      setValue("departureAirportId", formFlight.departureAirportId);
      setValue("arrivalAirportId", formFlight.arrivalAirportId);
      setValue("price", formFlight.price);
      setValue("isReturnTrip", formFlight.isReturnTrip);
      setValue("hasStops", formFlight.hasStops);
      const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      };

      
    setValue("departureDateTime", formatDate(formFlight.departureDateTime));
    setValue("arrivalDateTime", formatDate(formFlight.arrivalDateTime));
    }
  }, [formFlight]);

  const loadFlight = async () => {
    Promise.all([
      axios.get(`${baseUrl}/flight/get/${flightId}`, { headers: await authHeader() }),
      axios.get(`${baseUrl}/airport/get/city/${oriId}`, { headers: await authHeader() }),
      axios.get(`${baseUrl}/airport/get/city/${destId}`, { headers: await authHeader() }),
      axios.get(`${baseUrl}/airport/list`, { headers: await authHeader() })
    ])
      .then(([flightRes, oriRes, destRes, allRes]) => {
        setFormFlight(flightRes.data.data);
        setOriAirports(oriRes.data.data);
        setDestAirports(destRes.data.data);
        setAllAirports(allRes.data.data);
      })
      .catch(err => Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "Could not load flight info",
              }));
  };

  const onSubmit = async (data: Flight) => {
    const payload = {
      flightNumber: data.flightNumber,
      departureAirportId: data.departureAirportId,
      arrivalAirportId: data.arrivalAirportId,
      departureDateTime: data.departureDateTime,
      arrivalDateTime: data.arrivalDateTime,
      price: data.price,
      isReturnTrip: data.isReturnTrip,
      hasStops: data.hasStops
    };

    axios
  .put(`${baseUrl}/flight/update/${flightId}`, payload, { headers: await authHeader() })
  .then(res => {
    if (res.data.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res.data.message,
      });
      handleClose();
      onRefresh();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: res.data.message || 'Flight update failed.',
      });
    }
  })
  .catch(() => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Request failed',
    });
  });

  };



  return (
    <Modal visible={show} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Flight</Text>  

          <View style={styles.inputGroup}>
            <Controller
                control={control}
                name="isReturnTrip"
                render={({ field: { onChange, value } }) => (
                <View style={styles.switchRow}>
                  <Text>Return Trip</Text>
                  <Switch value={value} onValueChange={onChange} />
                </View>
                )}
              />
              
              <Controller
                control={control}
                name="hasStops"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.switchRow}>
                    <Text>Has Stops</Text>
                    <Switch value={value} onValueChange={onChange} />
                  </View>
                  )}
              />
            </View>  
            
            <View style={styles.inputGroup}>                
              <Text style={styles.label}>Flight Number</Text>
              <Controller
                control={control}
                name="flightNumber"
                rules={{ required: "Flight Number is required." }}
                render={({ field: { onChange, value } }) => (
                  <TextInput                   
                    style={[styles.input, errors.flightNumber && styles.errorInput]}
                    placeholder="Flight Number..."
                    placeholderTextColor='#888' 
                    value={value || ''}
                    onChangeText={onChange}
                  />
                )}
              /> 
              {errors.flightNumber && <Text style={styles.error}>{errors.flightNumber.message}</Text>}                                 
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (€)</Text>
              <Controller
                control={control}
                name="price"
                rules={{ required: "Price is required." }}
                render={({ field: { onChange, value } }) => (
                  <TextInput                   
                    style={[styles.input, errors.price && styles.errorInput]}
                    placeholder="Price..."
                    placeholderTextColor='#888' 
                    value={value?.toString() || ""}
                    onChangeText={onChange}
                  />
                )}
              />  
               {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}                                                    
            </View>                        

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Departure Airport</Text>
              <Controller
                control={control}
                name="departureAirportId"
                rules={{ required: "Departure Airport is required." }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    style={[styles.dropdown, errors.departureAirportId && styles.errorInput]}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.Text}
                    itemTextStyle={styles.Text}
                    data={( hasStops ? allAirports : isReturnTrip ? destAirports : oriAirports).map(a => ({
                      label: a.name,
                      value: a.id,
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Departure Airport"
                    value={value || undefined}
                    onChange={item => onChange(item.value)}
                  />   
                )}
              />  
              {errors.departureAirportId && <Text style={styles.error}>{errors.departureAirportId.message}</Text>}                                        
                                               
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Arrival Airport</Text>
            <Controller
                control={control}
                name="arrivalAirportId"
                rules={{ required: "Arrival Airport is required." }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    style={[styles.dropdown, errors.arrivalAirportId && styles.errorInput]}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.Text}
                    itemTextStyle={styles.Text}
                    data={( hasStops ? allAirports : isReturnTrip ? oriAirports : destAirports).map(a => ({
                      label: a.name,
                      value: a.id,
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Arrival Airport"
                    value={value || undefined}
                    onChange={item => onChange(item.value)}
                  /> 
                )}
              /> 
               {errors.arrivalAirportId && <Text style={styles.error}>{errors.arrivalAirportId.message}</Text>}                                                             
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Departure Date Time</Text> 
            <Controller
                control={control}
                name="departureDateTime"
                rules={{
                  required: "Departure Date is required.",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
                    message: "Use format YYYY-MM-DD HH:mm",
                  },
                  validate: value => {
                    const inputDate = new Date(value.replace(' ', 'T'));
                    if (isNaN(inputDate.getTime())) {
                      return "Invalid date format.";
                    }
                    const now = new Date();
                    if (inputDate <= now) {
                      return "Departure must be in the future.";
                    }
                    return true;
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput                    
                    style={[styles.input, errors.departureDateTime && styles.errorInput]}
                    placeholder="YYYY-MM-DD HH:mm"
                    placeholderTextColor='#888' 
                    value={value || ''}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.departureDateTime && <Text style={styles.error}>{errors.departureDateTime.message}</Text>}                                        
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Arrival Date Time</Text>
            <Controller
                control={control}
                name="arrivalDateTime"
                rules={{
                  required: "Arrival Date is required.",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
                    message: "Use format YYYY-MM-DD HH:mm",
                  },
                  validate: value => {
                    const inputDate = new Date(value.replace(' ', 'T'));
                    if (isNaN(inputDate.getTime())) {
                      return "Invalid date format.";
                    }
                    const now = new Date();
                    if (inputDate <= now) {
                      return "Arrival must be in the future.";
                    }
                    return true;
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                  style={[styles.input, errors.arrivalDateTime && styles.errorInput]}
                    placeholder="YYYY-MM-DD HH:mm"
                    placeholderTextColor='#888' 
                    value={value || ''}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.arrivalDateTime && <Text style={styles.error}>{errors.arrivalDateTime.message}</Text>}             
            </View>
        
            <TouchableOpacity style={styles.Addbtn} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.ButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Cancelbtn} onPress={handleClose}>
              <Text style={styles.ButtonText}>Cancel</Text>
            </TouchableOpacity>  
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  card:{ backgroundColor: '#fff', margin: 40, padding: 20, borderRadius: 8 },
  input: { backgroundColor: '#fff', color: '#000', padding: 10, borderRadius: 5, fontSize: 16, borderWidth: 1, borderColor: '#000' },  
  label: { color: '#000', marginBottom: 5, fontWeight: 'bold', fontSize: 16 },  
  inputGroup: { marginBottom: 15 },
  dropdown: { height: 40, borderRadius: 5, paddingHorizontal: 10, backgroundColor: '#fff',  borderWidth: 1, borderColor: '#000'  },
  dropdownContainer: { borderRadius: 8, backgroundColor: '#fff', },
  placeholder: { color: '#999', fontSize: 14, },
  Text: { color: '#000', fontSize: 14, },
  Addbtn: { backgroundColor: '#28a745', padding: 8, borderRadius: 10, alignItems: 'center', marginTop: 12, },
  Cancelbtn: { backgroundColor: 'grey', padding: 8, borderRadius: 10, alignItems: 'center', marginTop: 12, },
  ButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', },  
  error: { color: "red", fontSize: 12, },
  errorInput: { borderColor: 'red', borderWidth: 1 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", },
  title: { fontSize: 24, color: '#000', marginBottom: 20 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
});


export default FlightEdit;
