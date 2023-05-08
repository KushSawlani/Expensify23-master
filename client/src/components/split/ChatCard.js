import { Text } from "react-native";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useEffect, useState } from "react";

const ChatCard = ({ item, grpId }) => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [letUserMe, setLetUserMe] = useState(false);
  const handleUserId = async () => {
    setUserId(await AsyncStorage.getItem("userId"));
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    item?.withUsers.forEach((wu) => {
      if (wu.userId === userId) {
        setLetUserMe(true);
      }
    });
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("TransDetails", { item, grpId })}
        className={`rounded-2xl overflow-hidden w-52 bg-[#2A2E39] ${
          item?.paidBy === userId ? "self-end" : "self-start"
        }`}
        activeOpacity={0.8}
      >
        <View className="border bg-[#2E3442] border-[#404657] mt-2 ml-2 rounded-full w-24 p-1 px-4">
          <Text className="text-sm text-white">
            {moment(item?.txDate).format("DD/MM/YY")}
          </Text>
        </View>
        <View className="flex flex-col">
          {!letUserMe ? (
            <>
              <View className="h-10 flex items-center justify-center ">
                <Text className="text-[#b9fda4] text-2xl">
                  <FontAwesome name="rupee" size={20} color="#b9fda4" />{" "}
                  {Math.round(item?.lent)}
                </Text>
              </View>
              <View className="bg-[#2E3442] p-4">
                <Text className="text-center text-white">You'll get for</Text>
                <Text className="text-center text-white">
                  {item?.description}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View className="h-10 justify-center flex items-center">
                <Text className="text-rose-300 text-2xl">
                  <FontAwesome name="rupee" size={20} color="#fda4af" />{" "}
                  {Math.round(item?.lent)}
                </Text>
              </View>
              <View className="bg-[#2E3442] p-4">
                <Text className="text-center text-white">You'll pay for</Text>
                <Text className="text-center text-white">
                  {item.description}
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ChatCard;
