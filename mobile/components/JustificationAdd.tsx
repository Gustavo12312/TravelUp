import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from 'expo-router';
import authHeader from "../utils/auth.header";
import { useAuthentication } from "../utils/auth.utils";
import { url } from "./Host";
import Toast from "react-native-toast-message/lib";

const baseUrl = url;

const JustificationAdd = ({ requestId, show, handleClose, onRefresh }: { requestId: number; show: boolean; handleClose: () => void; onRefresh: () => void;}) => {
    const router = useRouter();
    const Authenticated = useAuthentication();
    type FormValues = {
        justification: string;
      };
      
      const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();      

    useEffect(() => {
        if (!Authenticated) {
            router.push('/login');
        }
    }, [Authenticated, router]);

    // Reset the justification when modal is closed
    useEffect(() => {
        if (!show) {
            setValue("justification", "");
        }
    }, [show, setValue]);

    const onSubmit = async (data: { justification: string }) => {
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
                } else {             
                     Toast.show({type: "error", text1: "Error", text2: response.data.message || "Error updating request"});
                }
            })
            .catch((error) => {                
                Toast.show({type: "error", text1: "Error", text2: "Error: " + error});
            });
    };

    return (
        <Modal visible={show} animationType="slide" onRequestClose={handleClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Justification</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Justification..."
                        multiline
                        numberOfLines={4}
                        {...register("justification", { required: true })}
                    />
                    {errors.justification && <Text style={styles.errorText}>Justification is required</Text>}
                    <View style={styles.buttonsContainer}>
                        <Button title="Reject" color="red" onPress={handleSubmit(onSubmit)} />
                        <Button title="Cancel" onPress={handleClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dimmed background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 10,
    },
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
        justifyContent: 'space-between',
    },
});

export default JustificationAdd;
