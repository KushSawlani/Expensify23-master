import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { sendOTP } from "../../api/user";

const MobileNumber = ({ setPhoneNumber, phoneNumber }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleOTP = async () => {
    try {
      setLoading(true);
      const data = await sendOTP(phoneNumber);
      setLoading(false);
      // if (data.data?.status === "pending") {
      navigation.navigate("EnterOTP");
      // } else {
      //   Alert.alert("Error!", "Please enter valid number!", [{ text: "Okay" }]);
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
        {!loading ? (
          <View className="mx-3 h-screen flex-1 ">
            <View className="mt-3 flex flex-row items-center">
              <AntDesign name="left" size={20} color="white" />
              <Text className="text-xl text-white ml-10">
                Enter Mobile Number
              </Text>
            </View>
            <Text className="text-white text-sm mt-5">
              We'll send an OTP to verify that it's you.
            </Text>
            <View className="border-2 border-[#5651A0] mt-2 rounded-lg p-2 flex flex-row">
              <Text className="text-white text-base tracking-widest">
                +91 |{" "}
              </Text>
              <TextInput
                className="text-white text-base tracking-widest"
                onChangeText={setPhoneNumber}
                keyboardType="decimal-pad"
                value={phoneNumber}
                placeholder="  -   -   -   -   -   -   -   -   -   -"
                placeholderTextColor="#717171"
              />
            </View>
            <View className="mt-2 absolute bottom-10 w-full">
              <TouchableOpacity
                className="bg-[#5651A0] p-2 rounded   items-center"
                onPress={handleOTP}
              >
                <Text className="text-white text-base">SEND OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View className="m-auto">
              <ActivityIndicator size="large" color="white" />
            </View>
          </>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default MobileNumber;
