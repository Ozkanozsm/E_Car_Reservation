import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, StyleSheet, Text, Button, TextInput, Alert } from "react-native";

const Web3 = require("web3");
import { useAuthStore } from "../../utils/authStates";
import {
  backendurl,
  stationRegisterMessage,
  web3url,
} from "../../utils/constants";

function StationChangePriceScreen({ navigation }) {
  const authStore = useAuthStore();

  const [price1, setPrice1] = useState(0);
  const [start1, setStart1] = useState(0);
  const [end1, setEnd1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [start2, setStart2] = useState(0);
  const [end2, setEnd2] = useState(0);

  const sendPriceChange = async () => {
    const web3 = new Web3(web3url);
    const prices = {
      price1: parseInt(price1),
      start1: parseInt(start1),
      end1: parseInt(end1),
      price2: parseInt(price2),
      start2: parseInt(start2),
      end2: parseInt(end2),
    };
    const stationKey = await AsyncStorage.getItem("stationKey");
    const signed = web3.eth.accounts.sign(JSON.stringify(prices), stationKey);
    const address = web3.eth.accounts.privateKeyToAccount(stationKey);
    const data = {
      wallet_address: address.address,
      signature: signed.signature,
      prices,
    };
    console.log(data);

    const fetchli = await fetch(`${backendurl}/station/changeprice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await fetchli.json();
    console.log(json);
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Price 1" onChangeText={setPrice1} />
      <TextInput placeholder="Start 1" onChangeText={setStart1} />
      <TextInput placeholder="End 1" onChangeText={setEnd1} />
      <TextInput placeholder="Price 2" onChangeText={setPrice2} />
      <TextInput placeholder="Start 2" onChangeText={setStart2} />
      <TextInput placeholder="End 2" onChangeText={setEnd2} />

      <Button
        title="CHANGE PRICE"
        onPress={async () => {
          await sendPriceChange();
        }}
      />
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
});

export default StationChangePriceScreen;
