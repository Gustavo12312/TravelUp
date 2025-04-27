import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Modal, Button, FlatList, StyleSheet } from "react-native";
import { format } from "date-fns";
import axios from "axios";
import authHeader from "../utils/auth.header";
import { useAuthentication } from "../utils/auth.utils";
import JustificationAdd from "./JustificationAdd";
import { useRouter } from 'expo-router';
import { url } from "./Host";

const baseUrl = url;

const RequestManager = ({ refreshTrigger, onRefresh }: { refreshTrigger: any, onRefresh: any }) => {
    const [dataRequest, setDataRequest] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {        
        loadRequest();        
    }, [refreshTrigger]);

    const loadRequest = async () => {
        const headers = await authHeader();
        const url = baseUrl + "/request/get/status/cost/6";
        axios.get(url, { headers })
            .then(res => {
                if (res.data.success) {
                    setDataRequest(res.data.data);
                } else {
                    alert("Error fetching requests");
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    function renderRequestItem({ item }: { item: any }) {
        return (
            <View style={styles.row}>
                <Text>{item.code}</Text>
                <Text>{item.user.name}</Text>
                <Text>{item.project.name}</Text>
                <Text>{format(new Date(item.travelDate), "dd/MM/yyyy")}</Text>
                <Text>{item.returnDate ? format(new Date(item.returnDate), "dd/MM/yyyy") : null}</Text>
                <Text>{item.Cost} €</Text>
                <Text>{item.project.budget - item.project.totalCost} €</Text>

                <TouchableOpacity
                    style={styles.buttonReject}
                    onPress={() => {
                        setShowAdd(true);
                        setSelectedRow(item.id);
                    }}>
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>

                
                {selectedRow !== null && (
                    <JustificationAdd
                        requestId={selectedRow}
                        show={showAdd}
                        handleClose={() => setShowAdd(false)}
                        onRefresh={onRefresh}
                    />
                )}

                <TouchableOpacity
                    style={styles.buttonApprove}
                    onPress={() => {
                        sendUpdateRequest(item.id, 5);
                        sendUpdateProject(item.project.id, item.Cost, item.project.totalCost);
                    }}>
                    <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const sendUpdateRequest = async (requestId: number, requestStatusId: number) => {
        const requesturl = baseUrl + '/request/update/' + requestId;
        const headers = await authHeader();
        const data = {
            requestStatusId: requestStatusId
        };
        
        axios.put(requesturl, data, { headers})
            .then((res) => {
                if (res.data.success === true) {
                    Alert.alert(res.data.message);
                    onRefresh();
                } else {
                    Alert.alert("Error updating request");
                }
            })
            .catch((error) => {
                Alert.alert("Error: " + error);
            });
    };

    const sendUpdateProject =async (projectId: number, cost: number, currentTotalCost: number) => {
        const projecturl = baseUrl + '/project/update/' + projectId;
        const headers = await authHeader();
        const data = {
            totalCost: currentTotalCost + cost
        };
        
        axios.put(projecturl, data, { headers })
            .then((res) => {
                if (res.data.success === true) {
                    Alert.alert(res.data.message);
                    onRefresh();
                } else {
                    Alert.alert("Error updating project");
                }
            })
            .catch((error) => {
                Alert.alert("Error: " + error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Pending Requests</Text>
            <FlatList
                data={dataRequest}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRequestItem}
                ListEmptyComponent={<Text>No Requests Found</Text>}
                nestedScrollEnabled={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    row: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#ddd",
    },
    buttonReject: {
        backgroundColor: "#ff6666",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonApprove: {
        backgroundColor: "#66ff66",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default RequestManager;
