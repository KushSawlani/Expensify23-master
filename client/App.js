import { StatusBar, Text, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Alert } from "react-native";
import TabNavigation from "./src/navigation/TabNavigation";
import { useEffect, useState } from "react";

export default function App() {
  const [noInternet, setNoInternet] = useState(false);
  const netInfo = useNetInfo();

  StatusBar.setBackgroundColor("#1E2128");

  // Checking internet connection
  const fetchnetInfo = () => {
    const { isConnected, isInternetReachable } = netInfo;
    if (isConnected === false && isInternetReachable === false)
      setNoInternet(true);
    else setNoInternet(false);
  };

  useEffect(() => {
    fetchnetInfo();
  }, [netInfo]);

  if (noInternet) {
    Alert.alert("No Internet");
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, background: "#1E2128" },
        }}
      >
        <TabNavigation />
      </NavigationContainer>
    </>
  );
}
