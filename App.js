import React from "react";
import { StyleSheet, Text, View } from "react-native";

import LineChart from "./app/LineChart";

const chartData = [
  { month: "Jan", value: Math.round(Math.random() * 300 + 1) },
  { month: "Feb", value: Math.round(Math.random() * 440 + 1) },
  { month: "Mar", value: Math.round(Math.random() * 940 + 1) },
  { month: "Apr", value: Math.round(Math.random() * 140 + 1) },
  { month: "May", value: Math.round(Math.random() * 340 + 1) },
  { month: "June", value: Math.round(Math.random() * 480 + 1) },
];

export default function App() {
  return (
    <View style={styles.screen}>
      <LineChart data={chartData} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#363759",
  },
});
