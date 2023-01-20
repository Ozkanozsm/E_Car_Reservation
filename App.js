import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View } from "react-native";
import UserScreen from "./screens/UserScreen";
import { useAuthStore } from "./utils/authStates";
const Web3 = require("web3");
import "./global";
import StationsScreen from "./screens/StationListScreen";
import MakeReservationScreen from "./screens/MakeReservationScreen";
import MyReservationsScreen from "./screens/MyReservationsScreen";
import MadeReservationScreen from "./screens/MadeReservationScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserScreen" component={UserScreen} />
      <Stack.Screen name="Stations" component={StationsScreen} />
      <Stack.Screen name="MakeReservation" component={MakeReservationScreen} />
      <Stack.Screen name="MyReservations" component={MyReservationsScreen} />
      <Stack.Screen name="MadeReservation" component={MadeReservationScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const authstore = useAuthStore();
  const privateKey = authstore.privateKey;
  useEffect(() => {
    const getLocalData = async () => {
      let data = await AsyncStorage.getItem("privateKey");
      if (data) {
        authstore.savePrivateKey(data);
      }
      setIsLoading(false);
    };
    getLocalData();
  }, []);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {privateKey ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function Root() {
  return <Navigation />;
}

export default function App() {
  return <Root />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
