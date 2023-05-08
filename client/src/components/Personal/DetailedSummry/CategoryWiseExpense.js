import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import Card from "../Card";
import { fetchCategoryWiseExpense } from "../../../api/user";

const CategoryWiseExpense = ({}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;

  const [userId, setUserId] = useState("");
  const [expenseData, setExpenseData] = useState([]);

  const handleExpenses = async () => {
    const data = await fetchCategoryWiseExpense(userId, category);
    setExpenseData(data.data);
  };

  const handleUserId = async () => {
    setUserId(await AsyncStorage.getItem("userId"));
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    handleExpenses();
  }, [userId]);

  return (
    <ScrollView className="m-3 mb-20">
      {expenseData !== undefined &&
        expenseData.map !== undefined &&
        expenseData.length > 0 &&
        expenseData.map((item, index) => (
          <Card key={index} navigation={navigation} item={item} />
        ))}
    </ScrollView>
  );
};

export default CategoryWiseExpense;
