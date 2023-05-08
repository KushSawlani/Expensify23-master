import React, { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { getUserInfo, updateUserInfo } from "../../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GeneralNavbar from "../GeneralNavbar";

const UpdateProfile = ({ setTabShown }) => {
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("123");
  const [userId, setUserId] = useState("");

  const handleUserId = async () => {
    setUserId(await AsyncStorage.getItem("userId"));
  };

  const handleSubmit = async () => {
    const obj = {
      name: name,
      upiId: upiId,
      id: userId,
    };
    const data = await updateUserInfo(obj);
    if (data?.success) {
      if (data.name === name || data?.upiId === upiId) {
        Alert.alert("Data updated successfully!");
      } else {
        Alert.alert("Some Error occured!");
      }
    }
  };

  const handleInfo = async () => {
    const data = await getUserInfo(userId);
    setName(data?.name);
    if (data?.upiId) {
      setUpiId(data?.upiId);
    } else {
      setUpiId("");
    }
  };

  useEffect(() => {
    handleUserId();
    setTabShown(false);
  }, []);

  useEffect(() => {
    handleInfo();
  }, [userId]);

  return (
    <>
      <GeneralNavbar title={"Update Profile"} navigationPath={"Settings"} />
      <View className="p-4 h-screen">
        <View className="flex items-center my-8">
          <Image
            className="h-32 w-32 rounded-full"
            source={require("../../assets/images/avatar2.png")}
          />
        </View>
        <View>
          <Text className="text-[#C0C1C6] font-medium text-base">Name</Text>
          <TextInput
            className="bg-[#2A2E39] text-[#B3B6BF] text-base rounded-lg px-4 py-2 mt-2"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className="mt-5">
          <Text className="text-[#C0C1C6] font-medium text-base">
            UPI ID (Optional)
          </Text>
          <TextInput
            className="bg-[#2A2E39] text-[#B3B6BF] text-base rounded-lg px-4 py-2 mt-2"
            value={upiId}
            onChangeText={setUpiId}
          />
        </View>
        <View className="absolute bottom-20 w-full mx-auto ml-3">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#5F68D1] py-2 rounded-lg mt-4  "
          >
            <Text className="text-center text-lg uppercase text-white">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default UpdateProfile;
