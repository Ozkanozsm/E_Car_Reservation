import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, StyleSheet, Text, Button, TextInput } from "react-native";

const Web3 = require("web3");
import { useAuthStore } from "../../utils/authStates";

function StationLoginScreen({ navigation }) {
  const authStore = useAuthStore();
  const [stationKey, setStationKey] = useState("");
  const registerStation = async () => {
    await AsyncStorage.setItem("stationKey", stationKey);
    navigation.navigate("StationDetailsScreen");
  };

  return (
    <View style={styles.container}>
      <Text>StationLogin</Text>
      <TextInput
        value={stationKey}
        onChangeText={setStationKey}
        placeholder="Station Private Key"
      />
      <Button
        title="Register Station"
        onPress={() => {
          registerStation();
        }}
      />
      <Button
        title="Change price"
        onPress={async () => {
          await AsyncStorage.setItem("stationKey", stationKey);
          navigation.navigate("StationChangeprice");
        }}
      />
      <Button
        title="Information"
        onPress={async () => {
          await AsyncStorage.setItem("stationKey", stationKey);
          navigation.navigate("StationInfo");
        }}
      />

      <Button title="Exit" onPress={() => authStore.setIsStation(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default StationLoginScreen;
