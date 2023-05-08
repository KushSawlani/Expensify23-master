import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "../Card";
import { fetchTodaysTransactions } from "../../../api/user";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";

const TodaySummary = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [selectDay, setSelectDay] = useState("Today");
  const [date, setDate] = useState(moment().subtract(0, "days"));

  const handleUserId = async () => {
    const id = await AsyncStorage.getItem("userId");
    setUserId(id);
  };

  const handleTransaction = async () => {
    const data = await fetchTodaysTransactions(userId, { date: date });
    setTransactions(data);
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    handleTransaction();
  }, [userId, date]);

  useEffect(() => {
    if (selectDay === "Today") {
      setDate(moment().subtract(0, "days"));
    } else if (selectDay === "Yesterday") {
      setDate(moment().subtract(1, "days"));
    }
  }, [selectDay]);

  return (
    <ScrollView className="mx-3" showsVerticalScrollIndicator={false}>
      {/* drop down for selection of category and date */}
      <View className=" bg-[#2A2E39] rounded-lg w-40 h-12 mt-5">
        <Picker
          style={{ color: "#6561CE" }}
          selectedValue={selectDay}
          onValueChange={(itemValue, itemIndex) => {
            setSelectDay(itemValue);
          }}
        >
          <Picker.Item label="Today" value="Today" />
          <Picker.Item label="Yesterday" value="Yesterday" />
        </Picker>
      </View>
      {/* Berakdown - category wise */}
      <View className="mt-5 mb-24">
        <Text className="text-lg text-white">Transcations</Text>
        {transactions.map !== undefined &&
          transactions.map((item, index) => (
            <Card key={index} navigation={navigation} item={item} />
          ))}
      </View>
    </ScrollView>
  );
};

export default TodaySummary;
