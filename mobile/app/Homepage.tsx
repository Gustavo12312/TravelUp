import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList} from 'react-native';
import RequestFacilitator from '../components/FacilitatorRequest';
import RequestTraveller from '../components/TravellerRequest';
import RequestManager from '../components/ManagerRequest';
import ManagerChart from '../components/ManagerChart';
import { useAuth } from '../utils/auth.context';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { useLocalSearchParams } from 'expo-router';


const Homepage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { authChanged, role, getRole, homeRefreshTrigger } = useAuth();
  const { refresh } = useLocalSearchParams();

  useEffect(() => {
    getRole();
  }, [authChanged]);

  useEffect(() => {
    handleRefresh();
  }, [refresh, homeRefreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  if (role === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (  
    <BackgroundWrapper>

     <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <>
    
  
    <ScrollView contentContainerStyle={styles.container}> 
      {role === 2 && (
        <>
          <Text style={styles.sectionTitle}>🎓 Facilitator Dashboard</Text>
          <View style={styles.card}>
            <Text style={styles.cardHeaderPrimary}>Pending Requests</Text>
            <RequestFacilitator status={0} refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardHeaderSuccess}>Approved Trips</Text>
            <RequestFacilitator status={1} refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
          </View>
        </>
      )}

      {role === 3 && (
        <>
          <Text style={styles.sectionTitle}>📊 Manager Dashboard</Text>
          <View style={styles.card}>
            <Text style={styles.cardHeaderWarning}>Requests Awaiting Approval</Text>
            <RequestManager refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardHeaderInfo}>Project Expenses</Text>
            <ManagerChart />
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>✈️ Your Travel Requests</Text>
      <View style={styles.card}>
        <Text style={styles.cardHeaderInfo}>Open Requests</Text>
        <RequestTraveller status={0}  refreshTrigger={refreshTrigger} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardHeaderSecondary}>Upcoming Trips</Text>
        <RequestTraveller status={1} refreshTrigger={refreshTrigger}/>
      </View>
    </ScrollView>
   
    </>
    }
  />
   </BackgroundWrapper>
  );
  
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 25,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeaderPrimary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 10,
  },
  cardHeaderSuccess: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 10,
  },
  cardHeaderWarning: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffc107',
    marginBottom: 10,
  },
  cardHeaderInfo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#17a2b8',
    marginBottom: 10,
  },
  cardHeaderSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 10,
  },
});

export default Homepage;
