import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfo } from "../../api/user";

const Navbar = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("User");

  const handleUserName = async () => {
    // API - fetch User name
    const data = await getUserInfo(userId);
    if (data?.success) {
      setName(data?.name);
      if (name) {
        await AsyncStorage.setItem("name", name);
      }
    }
  };

  const handleUserId = async () => {
    setUserId(await AsyncStorage.getItem("userId"));
  };

  useEffect(() => {
    handleUserId();
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    handleUserName();
  }, [isFocused]);

  useEffect(() => {
    handleUserName();
  }, [userId]);

  return (
    <View className="my-2">
      <View className="flex flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileNavigation")}
        >
          <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg mx-2 ml-5">Hi {name} </Text>
        <SimpleLineIcons name="badge" size={20} color="white" />
      </View>
    </View>
  );
};

export default Navbar;
