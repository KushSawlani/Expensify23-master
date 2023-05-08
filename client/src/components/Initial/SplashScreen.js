import React from "react";
import { View, Text, StatusBar, Image } from "react-native";
import AppIcon from "../../assets/images/AppIcon.jpg";

const SplashScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="#5F68D1" barStyle="light-content" />
      <View className="h-screen bg-[#5F68D1] items-center flex justify-center">
        <Image
          style={{ width: 120, height: 120, borderRadius: 10, marginTop: 20 }}
          source={AppIcon}
        />
        <Text className="text-white text-3xl font-extrabold tracking-wide mt-3">
          Expensify
        </Text>
      </View>
    </>
  );
};

export default SplashScreen;
