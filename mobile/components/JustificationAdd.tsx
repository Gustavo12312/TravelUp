import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import authHeader from "../utils/auth.header";
import { url } from "./Host";
import Toast from "react-native-toast-message/lib";
import { useAuth } from '@/utils/auth.context';

const baseUrl = url;

const JustificationAdd = ({ requestId, show, handleClose, onRefresh }: { requestId: number; show: boolean; handleClose: () => void; onRefresh: () => void;}) => {   
    type FormValues = {
        justification?: string;
      };    
       const { triggerHomeRefresh } = useAuth();  
      const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();         
    // Reset the justification when modal is closed
    useEffect(() => {
        if (!show) {
            setValue("justification", "");
        }
    }, [show, setValue]);

    const onSubmit = async (data: { justification?: string }) => {
        const headers = await authHeader();
        const datapost = {
            requestStatusId: 1,
            justification: data.justification,
        };

        const url = baseUrl + "/request/update/" + requestId;

        axios
            .put(url, datapost, { headers })
            .then((response) => {
                if (response.data.success) {
                     Toast.show({type: "success", text1: "Sucess", text2: response.data.message});                   
                    handleClose();
                    onRefresh();
                    triggerHomeRefresh();
                } else {             
                     Toast.show({type: "error", text1: "Error", text2: response.data.message || "Error updating request"});
                }
            })
            .catch((error) => {                
                Toast.show({type: "error", text1: "Error", text2: "Error: " + error});
            });
    };

    return (
        <Modal visible={show} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.card}>
                    <Text style={styles.modalTitle}>Add Justification</Text>
                    <Controller
                        control={control}
                        name="justification"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                            style={styles.input}
                            placeholder="Justification..."
                            placeholderTextColor='#888'
                            multiline
                            numberOfLines={4}
                            onChangeText={onChange}
                            value={value}
                            />
                        )}
                        />                  
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.Cancel} onPress={handleClose}>
                            <Text style={styles.ButtonText}>Cancel</Text>
                        </TouchableOpacity>  
                        <TouchableOpacity style={styles.Reject} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.ButtonText}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    card:{ backgroundColor: '#fff', margin: 40, padding: 20, borderRadius: 8 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    Reject: { backgroundColor: '#dc3545', padding: 8, borderRadius: 10, alignItems: 'center', marginTop: 12, width: 80 },
    Cancel: { backgroundColor: 'grey', padding: 8, borderRadius: 10, alignItems: 'center', marginTop: 12, width: 80 },
    ButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },  
});

export default JustificationAdd;
