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

function StationDetailsScreen({ navigation }) {
  const authStore = useAuthStore();
  const [wallet_address, setWalletAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [total_slots, setTotalSlots] = useState(0);
  const [price1, setPrice1] = useState(0);
  const [start1, setStart1] = useState(0);
  const [end1, setEnd1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [start2, setStart2] = useState(0);
  const [end2, setEnd2] = useState(0);

  const sendDetails = async () => {
    const web3 = new Web3(web3url);
    const stationKey = await AsyncStorage.getItem("stationKey");
    const stationAccount = web3.eth.accounts.privateKeyToAccount(stationKey);
    const stationAddress = stationAccount.address;
    setWalletAddress(stationAddress);
    const signed = web3.eth.accounts.sign(stationRegisterMessage, stationKey);
    const data = {
      wallet_address: stationAddress,
      signature: signed.signature,
      name: name,
      address: address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      total_slots: parseInt(total_slots),
      prices: {
        price1: parseInt(price1),
        start1: parseInt(start1),
        end1: parseInt(end1),
        price2: parseInt(price2),
        start2: parseInt(start2),
        end2: parseInt(end2),
      },
    };
    console.log(data);
    const fetchli = await fetch(`${backendurl}/station/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await fetchli.json();
    //convert json to string
    const jsonstring = JSON.stringify(json);
    Alert.alert("", jsonstring);
    console.log(json);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="station name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="station address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput placeholder="station lat" value={lat} onChangeText={setLat} />
      <TextInput placeholder="station lng" value={lng} onChangeText={setLng} />
      <TextInput
        placeholder="total slots"
        value={total_slots}
        onChangeText={setTotalSlots}
      />
      <TextInput placeholder="price1" value={price1} onChangeText={setPrice1} />
      <TextInput placeholder="start1" value={start1} onChangeText={setStart1} />
      <TextInput placeholder="end1" value={end1} onChangeText={setEnd1} />
      <TextInput placeholder="price2" value={price2} onChangeText={setPrice2} />
      <TextInput placeholder="start2" value={start2} onChangeText={setStart2} />
      <TextInput placeholder="end2" value={end2} onChangeText={setEnd2} />
      <Button
        title="Register"
        onPress={async () => {
          await sendDetails();
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

export default StationDetailsScreen;
