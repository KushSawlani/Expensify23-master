import { View, Text, Image } from "react-native";
import GeneralNavbar from "../GeneralNavbar";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const SettlePayment = () => {
  return (
    <>
      <GeneralNavbar title={"Settle Payment"} navigationPath={"MainSplit"} />
      <View className="p-4">
        <View className="flex items-center my-6 space-y-2">
          <Text className="text-white text-3xl font-medium">Person Name</Text>
          <Text className="text-3xl text-emerald-300 font-medium">
            <FontAwesome name="rupee" size={24} color="#6ee7b7" /> 2332
          </Text>
        </View>
        <View>
          <Text className="text-white font-medium text-lg">Payment Mode</Text>
          <TouchableOpacity>
            <Text className="text-white font-medium">Paid using Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white font-medium">Pay using QR</Text>
          </TouchableOpacity>
          <Text className="text-white font-medium">Pay using </Text>
          <View className="flex flex-row justify-between my-4">
            <TouchableOpacity>
              <View>
                <Image
                  className="w-12 h-12 rounded-full"
                  source={require("../../assets/images/avatar2.png")}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View>
                <Image
                  className="w-12 h-12 rounded-full"
                  source={require("../../assets/images/avatar2.png")}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View>
                <Image
                  className="w-12 h-12 rounded-full"
                  source={require("../../assets/images/avatar2.png")}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View>
                <Image
                  className="w-12 h-12 rounded-full"
                  source={require("../../assets/images/avatar2.png")}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View>
                <Image
                  className="w-12 h-12 rounded-full"
                  source={require("../../assets/images/avatar2.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default SettlePayment;
