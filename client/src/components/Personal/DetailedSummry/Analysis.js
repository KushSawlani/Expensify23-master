import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardCategory from "./CardCategory";
import moment from "moment";
import {
  fetchCategories,
  fetchCurrentMonthTransactions,
  getBudget,
} from "../../../api/user";

const Analysis = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");
  const [visible, setVisible] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [budget, setBudget] = useState(0);
  const [totalExpenseOfMonth, setTotalExpenseOfMonth] = useState();
  const [categoryData, setCategoryData] = useState([]);

  const data = {
    labels: ["1-5", "6-10", "11-15", "16-20", "21-25", "25-30"],
    datasets: [
      {
        data: graphData,
      },
    ],
  };

  const toggleDropdown = () => {
    setVisible(!visible);
  };

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

  const handleGraphData = async () => {
    const data = await fetchCurrentMonthTransactions(userId);
    let amt = 0;
    const graphData = [0, 0, 0, 0, 0, 0];
    data.forEach !== undefined &&
      data.forEach((item) => {
        const day = parseInt(moment(item.txDate).format("DD"));

        // Categorize the expense into the appropriate group
        const index = Math.floor((day - 1) / 5);
        graphData[index] += item.amount;
      });
    setGraphData(graphData);
    console.log(graphData);
  };

  const handleChartData = () => {
    let colorArr = [
      "#ea6d95",
      "#ffea00",
      "#6f8ff9",
      "#b04e43",
      "#58CF6C",
      "#7B43A1",
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
    handleGraphData();
    handleBudget();
  }, [userId]);

  useEffect(() => {
    handleChartData();
  }, [categories]);

  return (
    <ScrollView className="mx-3" showsVerticalScrollIndicator={false}>
      {/* Navbar */}

      {/* drop down for selection of category and date */}
      <View className="flex flex-row mt-5">
        <TouchableOpacity className="flex flex-row bg-[#2A2E39] p-2 rounded-lg items-center">
          <Text className="text-[#6561CE]">
            {moment().startOf("month").format("DD")} {moment().format("MMM")} -{" "}
            {moment().endOf("month").format("DD")} {moment().format("MMM")}{" "}
          </Text>
          {/* <AntDesign name="down" size={15} color="#6561CE" /> */}
        </TouchableOpacity>
      </View>

      {/* spent of month in numbers */}
      <View className="bg-[#2A2E39] mt-4  p-3 rounded-xl">
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

        {/* Chart for representing monthly expense */}
        <View className="mt-3">
          <BarChart
            data={data}
            width={Dimensions.get("window").width - [48]}
            height={220}
            yAxisLabel="₹"
            chartConfig={{
              backgroundColor: "#706cc9",
              backgroundGradientFrom: "#353c4d",
              backgroundGradientTo: "#353c4d",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.7,
              useShadowColorFromDataset: false,
              decimalPlaces: 1,
            }}
            verticalLabelRotation={0}
          />
        </View>
      </View>

      {/* Berakdown - category wise */}

      <View className="mt-5 mb-24">
        <Text className="text-lg text-white">Categories Breakdown</Text>

        {categories !== undefined &&
          categories.length > 0 &&
          Array.isArray(categories) &&
          categories.map((item, index) => (
            <CardCategory navigation={navigation} key={index} item={item} />
          ))}
      </View>
    </ScrollView>
  );
};

export default Analysis;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efefef",
    height: 50,
    width: "90%",
    paddingHorizontal: 10,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    top: 50,
  },
});
