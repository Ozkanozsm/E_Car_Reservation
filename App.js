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
import StationsScreen from "./screens/userscreens/StationListScreen";
import MakeReservationScreen from "./screens/userscreens/MakeReservationScreen";
import MyReservationsScreen from "./screens/userscreens/MyReservationsScreen";
import MadeReservationScreen from "./screens/userscreens/MadeReservationScreen";
import StationLoginScreen from "./screens/stationscreens/StationLoginScreen";
import StationDetailsScreen from "./screens/stationscreens/StationDetailsScreen";
import StationChangePriceScreen from "./screens/stationscreens/StationChangePriceScreen";
import StationInfo from "./screens/stationscreens/StationInfoScreen";
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: "Login",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function StationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StationLoginScreen"
        component={StationLoginScreen}
        options={{
          title: "Station Login",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="StationDetailsScreen"
        component={StationDetailsScreen}
        options={{
          title: "Station Details",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="StationChangeprice"
        component={StationChangePriceScreen}
        options={{
          title: "Change Price",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="StationInfo"
        component={StationInfo}
        options={{
          title: "Station Info",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          headerStyle: {
            backgroundColor: "#a83254",
          },
          title: "User",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Stations"
        component={StationsScreen}
        options={{
          title: "Stations",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="MakeReservation"
        component={MakeReservationScreen}
        options={{
          title: "Make Reservation",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="MyReservations"
        component={MyReservationsScreen}
        options={{
          title: "My Reservations",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="MadeReservation"
        component={MadeReservationScreen}
        options={{
          title: "Made Reservation",
          headerStyle: {
            backgroundColor: "#a83254",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const authstore = useAuthStore();
  const privateKey = authstore.privateKey;
  const isStationLogin = authstore.isStation;
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
      {isStationLogin ? (
        <StationStack />
      ) : privateKey ? (
        <AuthenticatedStack />
      ) : (
        <AuthStack />
      )}
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
