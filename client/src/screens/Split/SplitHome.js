import { View } from "react-native";
import React, { useEffect } from "react";
import GroupList from "../../components/split/GroupList";
import GeneralNavbar from "../../components/GeneralNavbar";

const SplitHome = () => {
  return (
    <>
      <GeneralNavbar title={"Split Expense"} navigationPath={"Personal"} />
      <View className="p-4 mb-24">
        <GroupList />
      </View>
    </>
  );
};

export default SplitHome;
