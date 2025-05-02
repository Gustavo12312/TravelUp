import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { BarChart } from "react-native-chart-kit";
import { url } from "./Host";
import Toast from "react-native-toast-message";

const baseUrl = url;

type Project = {
    name: string;
    totalCost: number;
    budget: number;
  };
  

export default function ManagerChart() {
const [dataProject, setDataProject] = useState<Project[]>([]);


  useEffect(() => {
    LoadProject();
  }, []);

  const LoadProject = () => {
    axios
      .get(`${baseUrl}/project/list`)
      .then((res) => {
        if (res.data.success) {
          setDataProject(res.data.data);
        } else {          
          Toast.show({type: "error", text1: "Error", text2: "Error fetching data"});     
        }
      })
      .catch((error) => {  
         Toast.show({type: "error", text1: "Error", text2: error.message});     
      });
  };

  // Prepare chart data
  const chartLabels = dataProject.map((project) => project.name.length > 10
    ? project.name.slice(0, 10) + '…'
    : project.name
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: dataProject.map((project) => project.totalCost),
        color: () => "rgba(75, 192, 192, 0.8)",
        strokeWidth: 2,
      },
      {
        data: dataProject.map((project) => project.budget),
        color: () => "rgba(255, 99, 132, 0.8)",
        strokeWidth: 2,
      },
    ],
    legend: ["Total Cost (€)", "Budget (€)"],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Budget vs Total Cost</Text>
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 20}
        height={280}
        fromZero
        showValuesOnTopOfBars
        yAxisLabel="€"
        yAxisSuffix="" 
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
          propsForBackgroundLines: {
            strokeDasharray: "", // solid background lines
          },
        }}
        verticalLabelRotation={30}
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    borderRadius: 10,
  },
});
