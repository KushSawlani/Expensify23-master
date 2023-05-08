import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import CategorySummary from "../../components/Personal/CategorySummary";
import Navbar from "../../components/Personal/Navbar";
import LatestTransaction from "../../components/Personal/LatestTransaction";
import { ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const PersonalScreen = ({ navigation, setTabShown }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    setTabShown(true);
  }, [isFocused]);

  useEffect(() => {
    setTabShown(true);
  }, []);

  return (
    <View className="mx-3 ">
      <Navbar />
      <ScrollView className="h-[83vh]" showsVerticalScrollIndicator={false}>
        <Text className="text-[#E5E4E5] text-base mt-2">Your Spends</Text>
        <CategorySummary navigation={navigation} />
        <LatestTransaction navigation={navigation} />
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.9}
        className=" absolute top-[620] right-[0] bg-[#6561D2] p-2 rounded-lg  "
        onPress={() => {
          navigation.navigate("Personal-AddExpense", { tag: "add", item: "" });
        }}
      >
        <Text className="text-white text-base">+ Add Personal Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PersonalScreen;
