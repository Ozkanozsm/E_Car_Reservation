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
import {
  backendurl,
  statusResCancelled,
  statusResCompleted,
  statusResLate,
  statusResPaid,
  web3url,
} from "../utils/constants";

function MadeReservationScreen({ route, navigation }) {
  const { reservation } = route.params;

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
              color={"red"}
              title="Cancel Reservation"
              onPress={() => {
                console.log("cancel");
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Complete Reservation"
              onPress={() => {
                console.log("complete");
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
