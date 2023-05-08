import { StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Analysis from "../components/Personal/DetailedSummry/Analysis";
import CategoryWiseExpense from "../components/Personal/DetailedSummry/CategoryWiseExpense";

const Stack = createStackNavigator();

const AnalysisNavigation = () => {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar backgroundColor="#1E2128" barStyle="" />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Analysis"
      >
        <Stack.Screen name="Analysis">
          {(props) => <Analysis navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="CategoryWiseExpense">
          {(props) => <CategoryWiseExpense />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default AnalysisNavigation;
