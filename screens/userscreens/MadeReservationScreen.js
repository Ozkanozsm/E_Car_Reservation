import { Text, View, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Web3 = require("web3");
import { useEffect } from "react";
import {
  backendurl,
  statusResCancelled,
  statusResCompleted,
  statusResLate,
  statusResPaid,
  web3url,
} from "../../utils/constants";

function MadeReservationScreen({ route, navigation }) {
  const { reservation } = route.params;
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

  const cancelRes = async () => {
    const web3 = new Web3(web3url);
    const userPkey = await AsyncStorage.getItem("privateKey");
    const pkey = userPkey;
    myAccount = web3.eth.accounts.privateKeyToAccount(pkey);

    const { contractAddress, contractAbi, escrowAddress } =
      await getContractAll();
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    const txdata = contract.methods
      .cancelReservation(reservation.create_tx)
      .encodeABI();
    const rawCancelTx = {
      from: myAccount.address,
      to: contractAddress,
      data: txdata,
    };
    const required = await getTxRequired(rawCancelTx);
    console.log(required);

    rawCancelTx.gas = required.gas;
    rawCancelTx.nonce = required.nonce;
    console.log(1);

    const signedTx1 = web3.eth.accounts.signTransaction(rawCancelTx, pkey);
    const serializedReservationTx = (await signedTx1).rawTransaction;
    const result = await sendForContract(serializedReservationTx);
    console.log(result);
    Alert.alert("", "Reservation Succesfully Cancelled");
  };

  const completeRes = async () => {
    const web3 = new Web3(web3url);
    const userPkey = await AsyncStorage.getItem("privateKey");
    const pkey = userPkey;
    myAccount = web3.eth.accounts.privateKeyToAccount(pkey);
    const dataToSign = reservation.create_tx;
    const signed = web3.eth.accounts.sign(dataToSign, pkey);
    const data = {
      address: myAccount.address,
      signature: signed.signature,
      reservationHash: dataToSign,
    };
    const result = await fetch(`${backendurl}/reservation/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("a");
    const json = await result.json();
    console.log(json);
    Alert.alert("", "Reservation Succesfully Completed");
  };

  useEffect(() => {
    console.log(reservation);
  }, []);

  return (
    <View style={styles.container}>
      {reservation.status == statusResPaid ? (
        <Text style={{ color: "green" }}>Paid</Text>
      ) : reservation.status == statusResCancelled ? (
        <Text style={{ color: "red" }}>Cancelled</Text>
      ) : reservation.status == statusResLate ? (
        <Text style={{ color: "red" }}>Late</Text>
      ) : reservation.status == statusResCompleted ? (
        <Text style={{ color: "green" }}>Completed</Text>
      ) : null}
      <Text>Price: {reservation.value}</Text>
      <Text>
        Reserved At: {new Date(reservation.reserved_time).toLocaleString()}
      </Text>
      <Text>
        Reservation Start Time:{" "}
        {new Date(reservation.start_time * 1000).toLocaleString()}
      </Text>
      <Text>{reservation.duration / 60} minutes</Text>
      <Text>Create Tx: {reservation.create_tx}</Text>
      <Text>Bill Tx: {reservation.bill_tx}</Text>
      <Text>Cancel Tx: {reservation.cancel_tx}</Text>
      <Text>Complete Tx: {reservation.complete_tx}</Text>
      {reservation.status == statusResPaid ? (
        <View>
          <View style={styles.button}>
            <Button
              color={"#de2c2c"}
              title="Cancel Reservation"
              onPress={async () => {
                await cancelRes();
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              color={"#243ab5"}
              title="Complete Reservation"
              onPress={() => {
                completeRes();
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  pricing: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 10,
  },
});

export default MadeReservationScreen;
