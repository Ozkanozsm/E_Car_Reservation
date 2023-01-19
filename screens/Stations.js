import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Button,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";
import walletShortener from "../utils/walletshortener";
import { useUserDataStore } from "../utils/userDataStates";
const Web3 = require("web3");
import axios from "axios";
import { useEffect, useState } from "react";

function StationsScreen({ navigation }) {
  const [stationList, setStationList] = useState("");
  const [loading, setLoading] = useState(true);

  const getStations = async () => {
    console.log("getStations");
    const response = await axios.get("http://192.168.0.12:3000/station/list");
    const data = response.data;
    console.log(data);
    setStationList(data);
  };

  useEffect(() => {
    const stationGetter = async () => {
      await getStations();
      setLoading(false);
    };
    stationGetter();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Stations</Text>
      <Button
        title="Get Stations"
        onPress={() => {
          getStations();
        }}
      />
      {stationList ? (
        <FlatList
          data={stationList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item.name}</Text>
                <Text>{item.address}</Text>
              </View>
            );
          }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  wallet: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    marginVertical: 10,
  },
  userDetails: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  userDetail: {
    borderWidth: 2,
    borderColor: "#FFA500",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

export default StationsScreen;
