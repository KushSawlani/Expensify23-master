import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { Text, Image } from "react-native";

import GeneralNavbar from "../../components/GeneralNavbar";
import ChatCard from "../../components/split/ChatCard";
import * as Linking from "expo-linking";
import { FontAwesome } from "@expo/vector-icons";
import { getGrpTxs, grpExpenseForSettle, settleExpense } from "../../api/group";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bgImg from "../../assets/images/bg-dark.jpg";

const GroupChat = () => {
  const route = useRoute();
  const isFocus = useIsFocused();
  const navigation = useNavigation();

  const { item, grpId } = route.params;

  const [ModalOpen, setModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [chatData, setChatData] = useState(item.txs);
  const [settleAmount, setSettleAmount] = useState(0);
  const [settleUpiId, setSettleUpiId] = useState("");
  const scrollViewRef = useRef();

  const [expenseSettleData, setExpenseSettleData] = useState([]);

  const handleUserId = async () => {
    setUserId(await AsyncStorage.getItem("userId"));
  };

  const handleGrpExpenseForSettle = async () => {
    const data = await grpExpenseForSettle(userId, grpId);
    setExpenseSettleData(data);
  };

  const handleSettleExpense = async () => {
    const data = await settleExpense(grpId, {
      userId: userId,
      amount: settleAmount,
    });
    Alert.alert(data?.message);
  };

  const handleGroupTxs = async () => {
    const { data } = await getGrpTxs(grpId);
    setChatData(data.txs);
  };

  const handleUpiPayment = async () => {
    try {
      let linkToPay = `upi://pay?pa=${settleUpiId}&am=${settleAmount}`;
      const res = await Linking.canOpenURL(linkToPay);
      if (res) {
        Linking.openURL(linkToPay);
        handleSettleExpense();
      } else {
        Alert.alert("Invalid URL", "Can't open broken link!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleUserId();
  }, []);

  useEffect(() => {
    handleGrpExpenseForSettle();
    handleGroupTxs();
  }, [userId]);

  useEffect(() => {
    handleGroupTxs();
  }, [isFocus]);

  return (
    <>
      <GeneralNavbar
        title={item?.name}
        grpId={grpId}
        showDeleteIcon={true}
        deleteHandle={"grpDelete"}
        tag=""
        navigationPath={"MainSplit"}
      />
      <ImageBackground
        source={bgImg}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#8a3a3a",
        }}
      >
        <View className="p-4 pb-28 h-screen">
          {/* Settle Modal */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={ModalOpen}
            onRequestClose={() => setModalOpen(false)}
          >
            <View className="bg-[#2A2E39] h-screen p-4">
              <View className="flex flex-row justify-between">
                <Text className="text-white text-2xl font-medium">
                  Settle Balances
                </Text>
                <TouchableOpacity onPress={() => setModalOpen(false)}>
                  <Text className="font-medium text-xl text-[#8885ea]">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="my-4">
                {expenseSettleData.map !== undefined &&
                  expenseSettleData.map((item, idx) => (
                    <View
                      key={idx}
                      className="p-4 flex flex-row justify-between items-center"
                    >
                      <View className="flex flex-row  flex-1 space-x-4 items-center">
                        <View>
                          <Image
                            className="w-12 h-12 rounded-full"
                            source={require("../../assets/images/avatar2.png")}
                          />
                        </View>
                        <View>
                          <Text className="text-white font-medium">
                            {item.name}
                          </Text>
                          <Text className="text-emerald-400 text-base">
                            <FontAwesome
                              name="rupee"
                              size={14}
                              color="#34d399"
                            />
                            {item.owes}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setSettleAmount(item.owes);
                          setSettleUpiId(item.upiId);
                          setPaymentModalOpen(true);
                        }}
                        className="bg-[#2f3647] p-2 rounded-xl"
                      >
                        <Text className="text-center px-3 text-[#8885ea]">
                          Settle
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            </View>
          </Modal>

          {/* payment modal */}
          <Modal
            onRequestClose={() => setPaymentModalOpen(false)}
            visible={paymentModalOpen}
            animationType="side"
            transparent={true}
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 5,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(52, 52, 52, 0.8)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View className="px-5  space-y-5 absolute top-[550] ">
                <TouchableOpacity
                  className="bg-[#5F68D1] w-full p-2 mt-2 items-center rounded-md"
                  onPress={() => {
                    setPaymentModalOpen(false);
                    Alert.alert(
                      "Settle Expense",
                      "Are you sure you want to proceed?",
                      [
                        {
                          text: "Yes",
                          onPress: async () => {
                            handleSettleExpense();
                          },
                        },
                        { text: "Decline", style: "cancel" },
                      ]
                    );
                  }}
                >
                  <Text className="text-white tracking-widest text-base uppercase">
                    Record as cash payment
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-[#5F68D1] w-full p-2 mt-2 items-center rounded-md"
                  onPress={() => {
                    setPaymentModalOpen(false);
                    handleUpiPayment();
                  }}
                >
                  <Text className="text-white tracking-widest text-base uppercase">
                    make upi payment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* expenses */}
          <ScrollView
            className="mt-3"
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: false })
            }
            showsVerticalScrollIndicator={false}
          >
            <View className="flex flex-col">
              {chatData.map((chatItem, idx) => {
                return (
                  <View className="my-2" key={idx}>
                    <ChatCard item={chatItem} grpId={grpId} />
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* bottom buttons */}
          <View className="mb- flex flex-row space-x-5 mx-auto">
            <TouchableOpacity
              className="font-medium p-2 w-2/5 rounded-lg bg-[#6561D2] uppercase py-2 text-center"
              onPress={() => {
                setModalOpen(true);
              }}
            >
              <Text className="text-[#d6d9e3] text-base mx-auto">₹ Settle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="font-medium rounded-lg p-2 w-2/5  bg-[#6561D2] uppercase py-2 text-center"
              onPress={() => {
                navigation.navigate("GrpAddExpense", {
                  item,
                  grpId: grpId,
                  tag: "add",
                });
              }}
            >
              <Text className="text-[#d6d9e3] text-base mx-auto">
                + Expense
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default GroupChat;
