import { Alert, ScrollView, TextInput, View } from "react-native";
import { Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Modal } from "react-native";
import { useEffect, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import GeneralNavbar from "../../components/GeneralNavbar";
import { getUsers, getUsersByName } from "../../api/user";
import { createGroup } from "../../api/group";
import { useNavigation } from "@react-navigation/native";

const NewGroup = () => {
  const [name, setName] = useState("A");
  const [ModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [checked, setChecked] = useState(false);

  const navigation = useNavigation();

  const handleUsers = async () => {
    const { data } = await getUsers();
    setUsers(data);
  };

  const handleNewGrp = async () => {
    const obj = {
      name: name,
      members: members,
    };

    const data = await createGroup(obj);
    if (data?.success) {
      Alert.alert(data?.msg);
      navigation.navigate("MainSplit");
    }
  };
  const handleSearch = async (query) => {
    const data = await getUsersByName(query);
    setUsers(data);
  };

  useEffect(() => {
    handleUsers();
  }, []);

  return (
    <>
      <GeneralNavbar title={"Create Group"} navigationPath="MainSplit" />

      <View className="my-20 px-2">
        {/* Model for adding members */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={ModalOpen}
          onRequestClose={() => setModalOpen(!ModalOpen)}
        >
          <View className=" p-3 bg-[#2A2E39] h-screen">
            <Text className="text-white text-2xl font-medium my-4">
              Select group members
            </Text>
            <View className="border-2 p-2 border-[#575a80] rounded-xl">
              <TextInput
                placeholderTextColor={"#60656e"}
                placeholder="Search groups contact or number"
                onChangeText={(query) => handleSearch(query)}
                className="text-white"
              />
            </View>
            <View className="mt-5">
              {users.map !== undefined &&
                users.map((item, idx) => {
                  return (
                    <ScrollView showsVerticalScrollIndicator={false} key={idx}>
                      <View
                        key={idx}
                        className="p-2 flex flex-row my-1 rounded-lg items-center bg-[#2A2E39]"
                      >
                        <BouncyCheckbox
                          onPress={() => {
                            setMembers((prev) => [...prev, item.id]);
                          }}
                        />
                        <Text className="text-white">{item.name}</Text>
                      </View>
                    </ScrollView>
                  );
                })}
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalOpen(!ModalOpen);
              }}
              className="bg-[#615CAF] rounded-lg p-1 absolute bottom-6 left-3 w-full"
            >
              <Text className="text-center text-white text-lg uppercase">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Name & Member Field */}
        <View className="flex mx-auto items-center bg-gray-100 rounded-full w-[70] h-[70]">
          <Text className="text-5xl font-bold  text-center text-blue-900 p-2 px-5 rounded-full ">
            {name[0]}
          </Text>
        </View>
        <View className="mt-4">
          <Text className="mb-2 text-[#B6B7BC]">Group name</Text>
          <TextInput
            className="bg-[#2A2E39] text-[#d0d4dc] rounded-lg mt-2 px-4 py-2"
            placeholder="Eg- flatname,goa trip, etc"
            onChangeText={(e) => setName(e)}
            value={name}
          />
        </View>
        <View className="mt-6">
          <Text className="mb-2 mt-2 text-[#B6B7BC]">Add People</Text>
          <TouchableOpacity onPress={() => setModalOpen(true)}>
            <View className="bg-[#2A2E39] flex flex-row justify-between items-center p-4 rounded-lg">
              <Text className="text-[#d0d4dc] pt-1">
                Add people in this group
              </Text>
              <AntDesign name="down" size={20} color="#5F68D1" />
            </View>
          </TouchableOpacity>
        </View>
        <View className="items-center top-[200]">
          <TouchableOpacity
            className="bg-[#5F68D1] w-full p-2 mt-2 items-center rounded-md"
            onPress={handleNewGrp}
          >
            <Text className="text-white tracking-widest text-base">
              CREATE GROUP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default NewGroup;
