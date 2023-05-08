import { Image, Text } from "react-native";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getAllGrp } from "../../api/group";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupList = () => {
  const navigator = useNavigation();
  const [grpData, setGrpData] = useState([]);
  const isFocus = useIsFocused();
  const [userId, setUserId] = useState("");

  const handleGrpInfo = async () => {
    const data = await getAllGrp(userId);
    setGrpData(data);
  };

  const handleUserId = async () => {
    const id = await AsyncStorage.getItem("userId");
    setUserId(id);
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    handleGrpInfo();
  }, [isFocus, userId]);

  return (
    <>
      <View className="flex flex-row justify-between my-4">
        <Text className="text-white font-medium text-xl">Groups</Text>
        <TouchableOpacity
          onPress={() => navigator.navigate("CreateGroup")}
          className="items-center flex flex-row space-x-2"
        >
          <AntDesign name="plus" size={16} color="#6A62CE" />
          <Text className="text-[#6A62CE] font-medium">Create Group</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="mb-16" showsVerticalScrollIndicator={false}>
        <View className="flex space-y-4 mb-4">
          {grpData.map !== undefined &&
            grpData.map((item, idx) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigator.navigate("GroupChat", {
                      grpId: item._id,
                      grpName: item.name,
                      item: item,
                    });
                  }}
                  key={idx}
                >
                  <GroupCard grpName={item.name} />
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </>
  );
};

const GroupCard = ({ grpName }) => {
  return (
    <>
      <View className="flex flex-row justify-between items-center p-2 border-b-2 pb-5 border-b-[#2B2C3E]">
        <View className="bg-gray-100 flex rounded-full">
          <Text className="text-3xl font-bold  text-center text-blue-900 p-2 px-5 rounded-full ">
            {grpName[0]}
          </Text>
        </View>
        <View className="basis-3/4">
          <Text className="text-white text-lg font-medium">{grpName}</Text>
        </View>
      </View>
    </>
  );
};

export default GroupList;
