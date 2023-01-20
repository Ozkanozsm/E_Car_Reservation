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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { backendurl, web3url } from "../utils/constants";

function MakeReservationScreen({ route, navigation }) {
  const { station } = route.params;
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [selectedEpoch, setSelectedEpoch] = useState();
  const [resStatus, setResStatus] = useState();

  let myAccount;

  const getContractAll = async () => {
    const required = await fetch(backendurl + "/contract/all");
    const json = await required.json();
    return json;
  };

  const getTxRequired = async (tx) => {
    const required = await fetch(backendurl + "/transaction/required", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx: tx,
        address: myAccount.address,
      }),
    });
    const json = await required.json();
    return json;
  };

  const sendForContract = async (data) => {
    const tx = await fetch(backendurl + "/transaction/sendforcontract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signedTx: data,
      }),
    });
    const json = await tx.json();
    return json;
  };

  const sendForPrice = async (data) => {
    const tx = await fetch(backendurl + "/transaction/sendforprice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signedTx: data,
      }),
    });
    const json = await tx.json();
    return json;
  };

  const getPriceOfReservation = async (resHash) => {
    const priceres = await fetch(backendurl + "/reservation/price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationHash: resHash,
      }),
    });
    const json = await priceres.json();
    return json;
  };

  const makeReservation = async () => {
    const web3 = new Web3(web3url);
    const userPkey = await AsyncStorage.getItem("privateKey");
    const pkey = userPkey;
    myAccount = web3.eth.accounts.privateKeyToAccount(pkey);
    const { contractAddress, contractAbi, escrowAddress } =
      await getContractAll();
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    const durationEpoch = durationMinutes * 60;
    const endEpoch = selectedEpoch + durationEpoch;
    const txdata = contract.methods
      .makeReservation(station.wallet, selectedEpoch, endEpoch)
      .encodeABI();
    console.log(0.1);
    console.log(1);
    const rawReservationTx = {
      from: myAccount.address,
      to: contractAddress,
      data: txdata,
    };
    const required = await getTxRequired(rawReservationTx);

    rawReservationTx.gas = required.gas;
    rawReservationTx.nonce = required.nonce;

    const signedTx1 = web3.eth.accounts.signTransaction(rawReservationTx, pkey);
    const serializedReservationTx = (await signedTx1).rawTransaction;
    const result = await sendForContract(serializedReservationTx);
    setResStatus("reservation contract call sent, waiting for confirmation");
    const restxhash = result.receipt.transactionHash;
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const priceres = await getPriceOfReservation(restxhash);
    const price = priceres.value;
    const rawPriceTx = {
      from: myAccount.address,
      to: escrowAddress,
      value: Number(web3.utils.toWei(price.toString(), "ether")),
      data: web3.utils.asciiToHex(restxhash),
    };
    const requiredPrice = await getTxRequired(rawPriceTx);
    rawPriceTx.gas = requiredPrice.gas;
    rawPriceTx.nonce = requiredPrice.nonce;
    const signedTx2 = web3.eth.accounts.signTransaction(rawPriceTx, pkey);
    const serializedPriceTx = (await signedTx2).rawTransaction;
    const resultPrice = await sendForPrice(serializedPriceTx);
    const pricetxhash = resultPrice.receipt.transactionHash;
    setResStatus("reservation price and contract call sent, reservation made");
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setSelectedEpoch(date.getTime() / 1000);
    hideDatePicker();
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Text>İstasyon: {station.name}</Text>
      <Text>Adres: {station.address}</Text>
      <Text>Slot Sayisi: {station.total_slots}</Text>
      <View style={styles.pricing}>
        <Text>Fiyatlar:</Text>
        <Text>
          {station.pricing[0].start}:00-{station.pricing[0].end}
          :00 {station.pricing[0].price} ETH
        </Text>
        <Text>
          {station.pricing[1].start}:00-{station.pricing[1].end}
          :00 {station.pricing[1].price} ETH
        </Text>
      </View>
      <View>
        <Button title="Show Date Picker" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          minuteInterval={15}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>

      {selectedDate && <Text> {selectedDate.toString().substr(0, 24)}</Text>}

      <Text>{durationMinutes}</Text>
      <Button
        title="+15"
        onPress={() => {
          setDurationMinutes(durationMinutes + 15);
        }}
      />
      <Button
        title="-15"
        onPress={() => {
          if (durationMinutes > 15) {
            setDurationMinutes(durationMinutes - 15);
          }
        }}
      />

      <Button
        title="Make Reservation"
        onPress={() => {
          makeReservation();
        }}
      />
      <Text>{resStatus}</Text>
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
  pricing: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MakeReservationScreen;
