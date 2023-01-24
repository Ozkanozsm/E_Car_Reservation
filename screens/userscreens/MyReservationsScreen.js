import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Web3 = require("web3");
import axios from "axios";
import { useEffect, useState } from "react";
import {
  backendurl,
  statusResCancelled,
  statusResCompleted,
  statusResLate,
  statusResPaid,
} from "../../utils/constants";

function MyReservationsScreen({ navigation }) {
  const [reservations, setReservations] = useState();
  const [loading, setLoading] = useState(true);

  const reservationsGetter = async () => {
    const web3 = new Web3();
    const pkey = await AsyncStorage.getItem("privateKey");
    const address = await web3.eth.accounts.privateKeyToAccount(pkey).address;
    let url = `${backendurl}/reservation/byuseraddress/${address}`;
    const res = await axios.get(url);

    //sort reservations by reserved_time in descending order
    const sorted = res.data.Reservations.sort((a, b) => {
      return new Date(b.reserved_time) - new Date(a.reserved_time);
    });
    setReservations(sorted);
    console.log(res.data);
  };

  useEffect(() => {
    const myResGetter = async () => {
      await reservationsGetter();
      setLoading(false);
    };
    myResGetter();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mtop}>
        <Button
          title="Refresh"
          color={"#a83254"}
          onPress={reservationsGetter}
        />
      </View>
      {reservations && (
        <FlatList
          style={{ width: "80%", marginTop: 10 }}
          data={reservations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.reservationItem}
              onPress={() => {
                navigation.navigate("MadeReservation", { reservation: item });
              }}
            >
              <View>
                {item.status == statusResPaid ? (
                  <Text style={{ color: "green" }}>Paid</Text>
                ) : item.status == statusResCancelled ? (
                  <Text style={{ color: "red" }}>Cancelled</Text>
                ) : item.status == statusResLate ? (
                  <Text style={{ color: "red" }}>Late</Text>
                ) : item.status == statusResCompleted ? (
                  <Text style={{ color: "green" }}>Completed</Text>
                ) : null}
                <Text>Price: {item.value}</Text>
                <Text>
                  Reserved At: {new Date(item.reserved_time).toLocaleString()}
                </Text>
                <Text>
                  Reservation Start Time:{" "}
                  {new Date(item.start_time * 1000).toLocaleString()}
                </Text>
                <Text>{item.duration / 60} minutes</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mtop: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    marginTop: 10,
  },
  reservationItem: {
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#a83254",
    borderWidth: 1,
    borderRadius: 15,
  },
});

export default MyReservationsScreen;
