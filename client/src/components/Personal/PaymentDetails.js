import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import moment from "moment";
import { deleteTransaction } from "../../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
const PaymentDetails = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [phoneNo, setPhoneNo] = useState("");

  useEffect(() => {
    const getUserPhoneNo = async () => {
      setPhoneNo(await AsyncStorage.getItem("phoneNumber"));
    };
    getUserPhoneNo();
  }, []);

  const handleDelete = async () => {
    Alert.alert("Delete Expense", "Are you sure?", [
      {
        text: "Yes",
        onPress: async () => {
          const data = await deleteTransaction({
            id: await AsyncStorage.getItem("userId"),
            txId: item._id,
          });
          if (data?.success) {
            Alert.alert("Expense successfully deleted!");
            navigation.goBack(null);
          } else {
            Alert.alert(data?.err);
          }
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  return (
    <>
      {/* Back navigation */}
      <View className="flex flex-row items-center m-3 justify-between">
        <View className="flex flex-row items-center">
          <Ionicons
            name="chevron-back-outline"
            style={{ marginRight: 10 }}
            size={22}
            color="white"
            onPress={navigation.goBack}
          />
          <Text className="text-white text-lg ">Your Payment</Text>
        </View>
        <View className="items-center flex flex-row space-x-4">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Personal-AddExpense", {
                item: item,
                tag: "edit",
              });
            }}
            className="mr-2"
          >
            <FontAwesome name="edit" size={19} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleDelete();
            }}
            className="mr-2"
          >
            <MaterialIcons
              name="delete"
              size={22}
              color="white"
              className="absolute"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="m-3 p-3 bg-[#2A2E39] rounded-xl ">
        <View className=" flex flex-row justify-between">
          <View>
            <Text className="text-[#B2B2B6] text-base">
              Your {item.description} Share
            </Text>
            <Text className="text-white mt-2 text-lg"> ₹ {item.amount}</Text>
          </View>
          <View className="items-center">
            <Text className="text-[#9c93d4] text-base"></Text>
            <View className="p-3 bg-[#abbda7] rounded-full w-12 h-12 mt-2">
              <MaterialIcons name="done" size={24} color="green" />
            </View>
          </View>
        </View>
        <Text className="text-gray-400 my-5">
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        </Text>

        <View>
          <Text className="text-white font-bold text-base">Rent Details</Text>

          <View className="flex flex-row justify-between mt-2">
            <Text className="text-[#C0BFC0]">Date</Text>
            <Text className="text-[#e4e3ea]">
              {moment(item.txDate).format("DD-MM-YYYY")}
            </Text>
          </View>
          <View className="flex flex-row justify-between mt-2">
            <Text className="text-[#C0BFC0]">Total Amount</Text>
            <Text className="text-[#e4e3ea]">₹ {item.amount}</Text>
          </View>
          <View className="flex flex-row justify-between mt-2">
            <Text className="text-[#C0BFC0]">Owner's Mobile No</Text>
            <Text className="text-[#e4e3ea]">{phoneNo}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default PaymentDetails;
