import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getUserRole } from '../utils/auth.utils';
import RequestFacilitator from '../components/FacilitatorRequest';
import RequestTraveller from '../components/TravellerRequest';
import RequestManager from '../components/ManagerRequest';
import ManagerChart from '../components/ManagerChart';
import { useAuth } from '../utils/auth.context';

const Homepage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { authChanged, role, getRole } = useAuth();

  useEffect(() => {
    const fetchRole = async () => {
      await getRole();
    };
    fetchRole();
  }, [authChanged]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  if (role === null) return <Text>Loading...</Text>;

  const sections = [];

  if (role === 2) {
    sections.push(
      { key: 'title-fac', content: <Text style={styles.title}>Facilitator Dashboard</Text> },
      {
        key: 'pending-requests',
        content: (
          <View style={styles.card}>
            <Text style={styles.cardHeaderPrimary}>Pending Requests</Text>
            <RequestFacilitator status={0} refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
          </View>
        )
      },
      {
        key: 'approved-trips',
        content: (
          <View style={styles.card}>
            <Text style={styles.cardHeaderSuccess}>Approved Trips</Text>
            <RequestFacilitator status={1} refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
          </View>
        )
      }
    );
  }

  if (role === 3) {
    sections.push(
      { key: 'title-mgr', content: <Text style={styles.title}>Manager Dashboard</Text> },
      {
        key: 'requests-approval',
        content: (
          <View style={styles.card}>
            <Text style={styles.cardHeaderWarning}>Requests Awaiting Approval</Text>
            <RequestManager refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
          </View>
        )
      },
      {
        key: 'project-expenses',
        content: (
          <View style={styles.card}>
            <Text style={styles.cardHeaderWarning}>Projects Expenses</Text>
            <ManagerChart />
          </View>
        )
      }
    );
  }

  // Always show traveler section
  sections.push(
    { key: 'title-trav', content: <Text style={styles.title}>Your Travel Requests</Text> },
    {
      key: 'open-requests',
      content: (
        <View style={styles.card}>
          <Text style={styles.cardHeaderInfo}>Open Requests</Text>
          <RequestTraveller status={0} />
        </View>
      )
    },
    {
      key: 'upcoming-trips',
      content: (
        <View style={styles.card}>
          <Text style={styles.cardHeaderSecondary}>Upcoming Trips</Text>
          <RequestTraveller status={1} />
        </View>
      )
    }
  );

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => item.content}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  cardHeaderPrimary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  cardHeaderSuccess: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  cardHeaderWarning: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffc107',
    marginBottom: 10,
  },
  cardHeaderInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#17a2b8',
    marginBottom: 10,
  },
  cardHeaderSecondary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 10,
  },
});

export default Homepage;
