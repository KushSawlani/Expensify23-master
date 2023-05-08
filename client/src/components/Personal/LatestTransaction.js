import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchLatestTransactions } from "../../api/user";
import { useIsFocused } from "@react-navigation/core";

const LatestTransaction = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState("");

  const handleTransaction = async () => {
    const data = await fetchLatestTransactions(userId);
    setTransactions(data.transactions);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    handleTransaction();
  }, [isFocused]);

  const handleUserId = async () => {
    const id = await AsyncStorage.getItem("userId");
    setUserId(id);
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    handleTransaction();
  }, [userId]);

  return (
    <View className="my-5 mb-16">
      <Text className="text-white text-base">Latest Transaction</Text>
      {transactions?.map !== undefined &&
        transactions.map((item, index) => (
          <Card key={index} navigation={navigation} item={item} />
        ))}
    </View>
  );
};

export default LatestTransaction;
