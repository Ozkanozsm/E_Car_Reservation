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
import { backendurl } from "../utils/constants";

function StationsScreen({ navigation }) {
  const [stationList, setStationList] = useState("");
  const [loading, setLoading] = useState(true);

  const getStations = async () => {
    console.log("getStations");
    const response = await axios.get(`${backendurl}/station/list`);
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
      <View style={styles.button}>
        <Button
          title="Refresh Stations"
          onPress={() => {
            getStations();
          }}
        />
      </View>
      {stationList ? (
        <FlatList
          style={{ width: "80%" }}
          data={stationList}
          keyExtractor={(station) => station.id}
          renderItem={({ item }) => {
            return (
              <View style={styles.stationItem}>
                <Pressable
                  onPress={() => {
                    console.log(item);
                    navigation.navigate("MakeReservation", {
                      station: item,
                    });
                  }}
                >
                  <Text>{item.name}</Text>
                  <Text>{item.address}</Text>
                  <Text>
                    Price Range :
                    {" " + item.pricing[0].price + "-" + item.pricing[1].price}
                  </Text>
                </Pressable>
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
  stationItem: {
    marginVertical: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#FFA500",
    borderWidth: 2,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    marginTop: 10,
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
