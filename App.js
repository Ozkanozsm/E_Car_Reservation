import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View } from "react-native";
import UserScreen from "./screens/UserScreen";
import { useAuthStore } from "./utils/authStates";

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
