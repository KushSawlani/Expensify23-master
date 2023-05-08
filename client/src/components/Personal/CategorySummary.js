import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import { PieChart } from "react-native-chart-kit";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCategories, getBudget } from "../../api/user";
import { useIsFocused } from "@react-navigation/native";

const CategorySummary = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [totalExpenseOfMonth, setTotalExpenseOfMonth] = useState(0);
  const [budget, setBudget] = useState(0);
  const isFocused = useIsFocused();

  const handleCategory = async () => {
    const data = await fetchCategories(userId);
    setCategories(data);
  };

  const handleUserId = async () => {
    setUserId(await AsyncStorage.getItem("userId"));
  };

  const handleBudget = async () => {
    const data = await getBudget(userId);

    setBudget(data.budget);
  };

  const handleChartData = () => {
    let colorArr = [
      "#e9c46a",
      "#ffbe0b",
      "#fb5607",
      "#ff006e",
      "#8338ec",
      "#3a86ff",
    ];
    let index = 0,
      totalExpense = 0;
    setCategoryData([]);
    setTotalExpenseOfMonth(0);
    if (Array.isArray(categories)) {
      categories.map((item) => {
        let schema = {
          name: "",
          total: 0,
          color: colorArr[index],
          legendFontColor: colorArr[index++],
          legendFontSize: 15,
        };
        schema.name = item.category;
        schema.total = item.total;
        totalExpense += item.total;
        setCategoryData((prev) => [...prev, schema]);
      });
      setTotalExpenseOfMonth(totalExpense);
    }
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    handleCategory();
    handleBudget();
  }, [userId]);

  useEffect(() => {
    handleChartData();
  }, [categories]);

  useEffect(() => {
    handleCategory();
    handleBudget();
    handleChartData();
  }, [isFocused]);

  return (
    <View className="bg-[#2A2E39] mt-2  p-3 rounded-xl">
      <View className="flex justify-between flex-row">
        <View className="">
          <Text className="text-[#C8CACF]">
            Spends in {moment().startOf("month").format("DD")}{" "}
            {moment().format("MMM")} - {moment().endOf("month").format("DD")}{" "}
            {moment().format("MMM")}
          </Text>
          <View className=" mt-3 flex flex-row">
            <Text className="text-white">₹ {totalExpenseOfMonth}</Text>
            <Text className="text-gray-300 text-xs"> / ₹ {budget}</Text>
          </View>
        </View>
        <View>
          <Text className="text-[#C8CACF]">
            {Math.ceil((100 * totalExpenseOfMonth) / budget)}% budget used
          </Text>
        </View>
      </View>

      <View className="bg-[#2E3442] h-56 rounded-lg mt-5">
        <PieChart
          data={categoryData}
          width={Dimensions.get("window").width - [15]}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          accessor={"total"}
          backgroundColor={"transparent"}
          center={[10, 0]}
          absolute
        />
      </View>
      <TouchableOpacity
        className="flex items-center mt-2 bg-[#343756] p-2 rounded-lg"
        onPress={() => navigation.navigate("Personal-ExpenseSummary")}
      >
        <Text className="text-white text-base">See Detailed Summary 🔥</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategorySummary;
