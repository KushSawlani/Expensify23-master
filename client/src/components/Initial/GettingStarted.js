import React from "react";
import { View, Text, StatusBar, Image, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AppIcon from "../../assets/images/AppIcon.jpg";

const GettingStarted = ({ navigation }) => {
  return (
    <>
      <StatusBar backgroundColor="#5F68D1" barStyle="light-content" />
      <View className="h-16 bg-[#5F68D1] items-center">
        <Image
          style={{ width: 80, height: 80, borderRadius: 10, marginTop: 20 }}
          source={AppIcon}
        />
      </View>
      <View className="mx-3 h-screen">
        <View className="flex items-center justify-center mt-16">
          <Text className="text-white text-2xl font-medium">Welcome to</Text>
          <Text className="text-[#6a71b8] text-2xl font-extrabold tracking-wide">
            Expensify
          </Text>
        </View>
        <View className="mt-5">
          <View className="flex flex-row items-center mt-8">
            <AntDesign name="piechart" size={30} color="#d6ad7b" />
            <View className="ml-5">
              <Text className="text-white font-bold text-lg">
                Track Personal Expenses
              </Text>
              <Text className="text-gray-300 text-sm">
                Stay up to date with every expense you make
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center mt-8">
            <MaterialIcons name="vertical-split" size={35} color="#6fd5ae" />
            <View className="ml-5">
              <Text className="text-white font-bold text-lg">Split Bills</Text>
              <Text className="text-gray-300 text-sm">
                Split bills with your friends and family
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center mt-8">
            <MaterialIcons name="payments" size={30} color="#5fa0d1" />
            <View className="ml-5">
              <Text className="text-white font-bold text-lg">
                Make Payments
              </Text>
              <Text className="text-gray-300 text-sm">
                Pay & recevie money easily & instantly
              </Text>
            </View>
          </View>
        </View>

        <View className="items-center top-1/4">
          <Text className="text-gray-200 text-xs">
            By continuing, you agree to our Privacy Policy and T&Cs
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MobileNumber");
            }}
            className="bg-[#5F68D1] w-screen p-2 mt-2 items-center"
          >
            <Text className="text-white tracking-widest text-base">
              GET STARTED
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default GettingStarted;
