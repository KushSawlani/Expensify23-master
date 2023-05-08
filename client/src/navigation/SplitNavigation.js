import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplitHome from "../screens/Split/SplitHome";
import NewGroup from "../screens/Split/NewGroup";
import GroupChat from "../screens/Split/GroupChat";
// import Navbar from "../components/personal/Navbar";
import ExpenseDetails from "../components/split/ExpenseDetails";
import SettlePayment from "../components/split/SettlePayment";
import GrpAddExpense from "../components/split/GrpAddExpense";

const Stack = createStackNavigator();

const SplitNavigation = ({ navigation }) => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="MainSplit"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainSplit">
          {(props) => <SplitHome navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="GroupChat">
          {(props) => <GroupChat navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="CreateGroup">
          {(props) => <NewGroup navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="TransDetails">
          {(props) => <ExpenseDetails navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="PaySettle">
          {(props) => <SettlePayment navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="GrpAddExpense">
          {(props) => <GrpAddExpense navigation={navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default SplitNavigation;
