import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";
import { useUserDataStore } from "../utils/userDataStates";
const Web3 = require("web3");
import axios from "axios";
import { useEffect, useState } from "react";
import { backendurl, web3url } from "../utils/constants";

function UserScreen({ navigation }) {
  const web3 = new Web3(web3url);

  const authstore = useAuthStore();
  const userDataStore = useUserDataStore();
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState();

  useEffect(() => {
    const balanceGetter = async () => {
      await getBalance();
    };
    balanceGetter();
  }, []);
  const logout = () => {
    console.log("logout");
    AsyncStorage.removeItem("privateKey");
    authstore.removePrivateKey();
  };

  const getBalance = async () => {
    const pkey = await AsyncStorage.getItem("privateKey");
    const address = await web3.eth.accounts.privateKeyToAccount(pkey).address;
    console.log(address);
    setAddress(address);
    try {
      const req = await axios.post(`${backendurl}/wallet/balance`, {
        address: address,
      });
      const balance = req.data.balance;
      setBalance(balance);
    } catch (err) {
      console.log(err);
    }
  };

  const makeReservation = () => {
    navigation.navigate("Stations");
  };

  const MyReservations = () => {
    navigation.navigate("MyReservations");
  };

  const RefreshData = async () => {
    console.log("refresh");
    const urlToRequest = `${backendurl}/user/list/` + userDataStore.id;
    console.log(urlToRequest);
    const res = await axios.get(urlToRequest);
    userDataStore.setTotalCancelled(res.data.total_cancelled);
    userDataStore.setTotalCompleted(res.data.total_completed);
    userDataStore.setTotalSpent(res.data.total_spent);
    userDataStore.setTotalMade(res.data.total_reservation);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.wallet}>
          <Text style={styles.bold}>Balance: {balance} ETH</Text>
        </View>

        <View style={styles.userDetails}>
          <View style={styles.userDetail}>
            <Text>All</Text>
            <Text>{userDataStore.total_made}</Text>
          </View>
          <View style={styles.userDetail}>
            <Text>Cancelled</Text>
            <Text>{userDataStore.total_cancelled}</Text>
          </View>
          <View style={styles.userDetail}>
            <Text>Completed</Text>
            <Text>{userDataStore.total_completed}</Text>
          </View>
          <View style={styles.userDetail}>
            <Text>Spent</Text>
            <Text>{userDataStore.total_spent}</Text>
          </View>
        </View>
        <View style={styles.btngroup}>
          <Pressable style={styles.button}>
            <Button title="Refresh" onPress={RefreshData} color="#a83254" />
          </Pressable>
          <Pressable style={styles.button}>
            <Button title="Balance" onPress={getBalance} color="#a83254" />
          </Pressable>
        </View>
        <View style={styles.btngroup2}>
          <Pressable style={styles.button2}>
            <Button
              title="Make Reservation"
              onPress={makeReservation}
              color="#a83254"
            />
          </Pressable>
          <Pressable style={styles.button2}>
            <Button
              title="My Reservations"
              onPress={MyReservations}
              color="#a83254"
            />
          </Pressable>
        </View>
      </View>
      <TouchableOpacity onPress={logout} style={styles.bottom}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignItems: "center",
    width: 200,
    backgroundColor: "#bcbcbc",
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  button2: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  btngroup2: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  btngroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  bold: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wallet: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    marginVertical: 10,
    marginHorizontal: 20,
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

export default UserScreen;
