import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import GeneralNavbar from "../GeneralNavbar";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearAllTxs, getAllTxs } from "../../api/user";
import Papa from "papaparse";

const Setting = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState([{}]);

  const handleUserId = async () => {
    setUserId(await AsyncStorage.getItem("userId"));
  };

  const handleUserData = async () => {
    const data = await getAllTxs(userId);
    setUserInfo(data.data);
  };

  const createCSV = async (data) => {
    const header = ["Description", "Category", "Amount"];
    const csvData = [
      header,
      ...data.map((item) => [item.description, item.category, item.amount]),
    ];
    return new Promise((resolve, reject) => {
      Papa.parse(Papa.unparse(csvData), {
        complete: (results) => resolve(results.data.join("\n")),
        error: (err) => reject(err),
      });
    });
  };

  const saveFile = async () => {
    const csvData = await createCSV(userInfo);
    let directoryUri = FileSystem.documentDirectory;

    let fileUri = directoryUri + "ExpenseTracker.csv";

    await FileSystem.writeAsStringAsync(fileUri, csvData.toString(), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await shareFile(fileUri);
  };
  const shareFile = async (fileUri) => {
    const canShare = await Sharing.isAvailableAsync();

    // Check if permission granted
    if (canShare) {
      try {
        await Sharing.shareAsync(fileUri);
        return true;
      } catch {
        return false;
      }
    } else {
      alert("Permission not granted!");
    }
  };

  const handleClearTxs = async () => {
    Alert.alert("Clear All Expenses", "Are you sure you want to proceed?", [
      {
        text: "Yes",
        onPress: async () => {
          const data = await clearAllTxs(userId);
          if (data?.success) {
            Alert.alert(data.message);
          } else {
            Alert.alert(data.message);
          }
        },
      },
      { text: "Decline", style: "cancel" },
    ]);
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    handleUserData();
  }, [userId]);

  return (
    <View>
      <GeneralNavbar title={"Settings"} navigationPath={"Profile"} />
      <View className="mt-5">
        <View className="flex flex-row space-x-6 mx-auto my-2">
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateProfile")}
            className="bg-[#2A2E39] w-36 p-2 pl-3 rounded-lg"
          >
            <FontAwesome name="user" size={24} color="#FBB567" />
            <Text className="text-white text-base mt-2">Personal Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#2A2E39] w-36 p-2 pl-3 rounded-lg"
            onPress={() => navigation.navigate("BudgetCycle")}
          >
            <Ionicons name="ios-wallet" size={24} color="#625C95" />
            <Text className="text-white text-base mt-2">Budget Cycle</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row space-x-6 mx-auto my-2">
          <TouchableOpacity
            onPress={() => {
              saveFile();
            }}
            className="bg-[#2A2E39] w-36 p-2 pl-3 rounded-lg"
          >
            <MaterialIcons name="cloud-download" size={24} color="#43ab39" />
            <Text className="text-white text-base mt-2">Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleClearTxs();
            }}
            className="bg-[#2A2E39] w-36 p-2 pl-3 rounded-lg"
          >
            <MaterialCommunityIcons
              name="cloud-refresh"
              size={24}
              color="#F28300"
            />
            <Text className="text-white text-base mt-2">Reset Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Setting;
