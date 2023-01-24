import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, TextInput, Alert } from "react-native";

const Web3 = require("web3");
import { useAuthStore } from "../../utils/authStates";
import {
  backendurl,
  stationRegisterMessage,
  web3url,
} from "../../utils/constants";

function StationInfo({ navigation }) {
  const [wallet_address, setWalletAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [info, setInfo] = useState({});
  const getStationInfo = async () => {
    console.log("getStationInfo");
    const stationKey = await AsyncStorage.getItem("stationKey");
    const web3 = new Web3(web3url);
    const myAccount = web3.eth.accounts.privateKeyToAccount(stationKey);
    setWalletAddress(myAccount.address);
    console.log(1);
    const response = await fetch(backendurl + "/station/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: myAccount.address,
      }),
    });
    const json = await response.json();
    if (response.status == 400) {
      setIsRegistered(false);
    } else {
      setInfo(json.stationInfo);
      setIsRegistered(true);
      console.log(json.stationInfo.pricing);
      console.log(json.stationInfo.pricing[0].price);
    }
    console.log(json);
  };

  useEffect(() => {
    getStationInfo();
  }, []);

  return (
    <View style={styles.container}>
      {isRegistered ? (
        <View>
          <Text>Name: {info.name}</Text>
          <Text>Address: {info.address}</Text>
          <Text>Latitude: {info.lat}</Text>
          <Text>Longitude: {info.lng}</Text>
          <Text>Slots: {info.total_slots}</Text>
          <View>
            <Text>Pricing</Text>
            <Text>
              {info.pricing[0].start}:00-{info.pricing[0].end}:00{">"}
              {info.pricing[0].price} ETH
            </Text>
            <Text>
              {info.pricing[1].start}:00-{info.pricing[1].end}:00{">"}
              {info.pricing[1].price} ETH
            </Text>
          </View>
          <View style={styles.userDetails}>
            <View style={styles.userDetail}>
              <Text>All</Text>
              <Text>{info.total_reserved}</Text>
            </View>
            <View style={styles.userDetail}>
              <Text>Cancelled</Text>
              <Text>{info.total_cancelled}</Text>
            </View>
            <View style={styles.userDetail}>
              <Text>Completed</Text>
              <Text>{info.total_completed}</Text>
            </View>
            <View style={styles.userDetail}>
              <Text>Earned</Text>
              <Text>{info.total_earned}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>Not Registered Yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 50,
  },
  userDetails: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    justifyContent: "center",
  },
  userDetail: {
    borderWidth: 2,
    borderColor: "#a83254",
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    width: 85,
  },
});

export default StationInfo;
