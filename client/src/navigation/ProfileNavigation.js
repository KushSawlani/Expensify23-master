import { useIsFocused } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import BudgetCycle from "../components/Profile/BudgetCycle";
import Profile from "../components/Profile/Profile";
import Setting from "../components/Profile/Setting";
import UpdateProfile from "../components/Profile/UpdateProfile";

const Stack = createStackNavigator();

const ProfileNavigation = ({ setTabShown }) => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile">
        {(props) => <Profile setTabShown={setTabShown} />}
      </Stack.Screen>
      <Stack.Screen name="Settings">{(props) => <Setting />}</Stack.Screen>
      <Stack.Screen name="UpdateProfile">
        {(props) => <UpdateProfile setTabShown={setTabShown} />}
      </Stack.Screen>
      <Stack.Screen name="BudgetCycle">
        {(props) => <BudgetCycle setTabShown={setTabShown} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
