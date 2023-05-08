import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createUser, verifyOTP } from "../../api/user";

const EnterOTP = ({ phoneNumber, onLogin }) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");

  const handleVerification = async () => {
    // API - verify & create user
    try {
      const data = await verifyOTP(phoneNumber, otp);
      // console.log(data);
      // if (data?.valid) {
      const userData = await createUser({
        phoneNumber: phoneNumber,
      });

      await AsyncStorage.setItem("phoneNumber", phoneNumber);
      await AsyncStorage.setItem("userId", userData?.userId);
      onLogin();
      navigation.navigate("Personal");
      // } else {
      //   Alert.alert("Invalid OTP", "Please enter correct OTP!", [
      //     { text: "Okay" },
      //   ]);
      // }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error, [{ text: "Okay" }]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="mx-3 h-screen flex-1 ">
          <View className="mt-3 flex flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("MobileNumber")}
            >
              <AntDesign name="left" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-xl text-white ml-10">Enter OTP</Text>
          </View>
          <Text className="text-white text-sm mt-5">
            Please enter 6-digit OTP sent on +91{phoneNumber} to continue
          </Text>
          <View className="border-2 border-[#5651A0] mt-2 rounded-lg p-2 flex w-full flex-row ">
            <TextInput
              className="text-white text-base tracking-widest justify-center "
              onChangeText={setOtp}
              value={otp}
              keyboardType="decimal-pad"
              placeholderTextColor="#717171"
            />
          </View>
          <View className="mt-2 absolute bottom-10 w-full">
            <TouchableOpacity
              className="bg-[#5651A0] p-2 rounded   items-center"
              onPress={() => {
                handleVerification();
              }}
            >
              <Text className="text-white text-base tracking-widest">
                VERIFY
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EnterOTP;
