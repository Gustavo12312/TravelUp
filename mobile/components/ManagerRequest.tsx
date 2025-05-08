import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { format } from "date-fns";
import { useRouter } from 'expo-router';
import axios from "axios";
import authHeader from "../utils/auth.header";
import JustificationAdd from "./JustificationAdd";
import { url } from "./Host";
import Toast from "react-native-toast-message/lib";

const baseUrl = url;

const RequestManager = ({ refreshTrigger, onRefresh }: { refreshTrigger: any, onRefresh: any }) => {
    const [dataRequest, setDataRequest] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
      const router = useRouter();

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
                    Toast.show({type: "error", text1: "Error", text2: "Error fetching requests"});
                }
            })
            .catch(error => {                
                Toast.show({type: "error", text1: "Error", text2: error});
                
            });
    }

    function renderRequestItem({ item }: { item: any }) {
        return (
             <TouchableOpacity
                onPress={() =>
                    router.push({
                      pathname: '/Request/RequestEdit',
                      params: { requestId: item.id },
                    })
                  } 
                  style={styles.itemContainer}
                >
          
                <Text style={styles.itemText}>Code: {item.code}</Text>
                <Text style={styles.itemText}>Requested By: {item.user.name}</Text>
                <Text style={styles.itemText}>Project: {item.project.name}</Text>
                <Text style={styles.itemText}>Travel: {format(new Date(item.travelDate), "dd/MM/yyyy")}</Text>
                <Text style={styles.itemText}>Return: {item.returnDate ? format(new Date(item.returnDate), "dd/MM/yyyy") : null}</Text>
                <Text style={styles.itemText}>Cost: {item.Cost} €</Text>
                <Text style={styles.itemText}>Budget Available: {item.project.budget - item.project.totalCost} €</Text>

                <TouchableOpacity
                    style={styles.buttonApprove}
                    onPress={() => {
                        sendUpdateRequest(item.id, 5);
                        sendUpdateProject(item.project.id, item.Cost, item.project.totalCost);
                    }}>
                    <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity> 

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
           
            </TouchableOpacity>
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
                    Toast.show({type: "success", text1: "Sucess", text2: res.data.message});                    
                    onRefresh();
                } else {                
                    Toast.show({type: "error", text1: "Error", text2: "Error updating request"});
                }
            })
            .catch((error) => {               
                Toast.show({type: "error", text1: "Error", text2: "Error: " + error});
                
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
                    Toast.show({type: "success", text1: "Success", text2: res.data.message});                    
                    onRefresh();
                } else {                    
                    Toast.show({type: "error", text1: "Error", text2: "Error updating project"});
                }
            })
            .catch((error) => {                
                Toast.show({type: "error", text1: "Error", text2: "Error: " + error});
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Pending Requests</Text>
            <FlatList
                data={dataRequest}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRequestItem}
                ListEmptyComponent={<Text style={styles.empty} >No Requests Found</Text>}
                nestedScrollEnabled={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
      },
    header: {
        fontSize: 22,
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
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonApprove: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    empty: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#555",
      },
      itemText: {
        fontSize: 16,
        marginBottom: 4,
      },
      itemContainer: {
        backgroundColor: "#f4f4f4",
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
      },
});

export default RequestManager;
