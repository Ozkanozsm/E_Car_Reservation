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
      <View style={styles.margver}>
        <Button
          color="#a83254"
          title="Register Station"
          onPress={() => {
            registerStation();
          }}
        />
      </View>
      <View style={styles.margver}>
        <Button
          title="Change price"
          color="#a83254"
          onPress={async () => {
            await AsyncStorage.setItem("stationKey", stationKey);
            navigation.navigate("StationChangeprice");
          }}
        />
      </View>

      <View style={styles.margver}>
        <Button
          title="Information"
          color="#a83254"
          onPress={async () => {
            await AsyncStorage.setItem("stationKey", stationKey);
            navigation.navigate("StationInfo");
          }}
        />
      </View>
      <View style={styles.margver}>
        <Button
          title="Exit"
          onPress={() => authStore.setIsStation(false)}
          color="#a83254"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  margver: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default StationLoginScreen;
