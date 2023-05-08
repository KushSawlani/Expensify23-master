import { View, Text } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TodaySummary from "../../components/Personal/DetailedSummry/TodaySummary";
import { Ionicons } from "@expo/vector-icons";
import AnalysisNavigation from "../../navigation/AnalysisNavigation";

const Tab = createMaterialTopTabNavigator();

const ExpenseSummaryScreen = ({ navigation }) => {
  return (
    <>
      <View className="flex flex-row items-center m-3">
        <Ionicons
          name="chevron-back-outline"
          style={{ marginRight: 10 }}
          size={22}
          color="white"
          onPress={navigation.goBack}
        />
        <Text className="text-white text-lg ">Expense Summary</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 16,
            color: "#6561D2",
            textTransform: "capitalize",
          },
          tabBarStyle: { backgroundColor: "#1E2128" },
        }}
        initialRouteName="AnalysisNavigation"
      >
        <Tab.Screen name="AnalysisNavigation" options={{ title: "Analysis" }}>
          {(props) => <AnalysisNavigation />}
        </Tab.Screen>
        <Tab.Screen
          name="TodaySummary"
          options={{
            tabBarItemStyle: { width: 140 },
            tabBarLabel: "Today's Summary",
            tabBarLabelStyle: {
              fontSize: 14,
              color: "#6561D2",
              textTransform: "capitalize",
            },
          }}
        >
          {(props) => <TodaySummary navigation={navigation} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};

export default ExpenseSummaryScreen;
