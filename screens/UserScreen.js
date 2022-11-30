import { Text, View, StyleSheet, Pressable, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";
import walletShortener from "../utils/walletshortener";
import { useUserDataStore } from "../utils/userDataStates";
const Web3 = require("web3");
import axios from "axios";
function UserScreen({ navigation }) {
  const web3 = new Web3("http://192.168.0.12:7545");
  const willSendAddress = "0xEf7B941E03032AC004c449Cf86fA32C6c65659d5";
  const value = web3.utils.toWei("0.0005", "ether");
  const txdata = web3.utils.utf8ToHex("HI FROM RNATIVE");
  const authstore = useAuthStore();
  const userDataStore = useUserDataStore();
  const logout = () => {
    console.log("logout");
    AsyncStorage.removeItem("privateKey");
    authstore.removePrivateKey();
  };

  const getGasPrice = async () => {
    let gas = await web3.eth.estimateGas({
      to: willSendAddress,
      value: value,
    });
    console.log(gas);
  };

  const sendTx = () => {
    console.log("sendTx");
    web3.eth
      .estimateGas({
        to: willSendAddress,
        value: value,
        data: txdata,
      })
      .then((estimatedGas) => {
        console.log("gas: ", estimatedGas);
        web3.eth.accounts
          .signTransaction(
            {
              to: willSendAddress,
              value: value,
              gas: estimatedGas,
              data: txdata,
            },
            authstore.privateKey
          )
          .then((signedTx) => {
            console.log(signedTx);
            web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log("yolladndı", signedTx.transactionHash);
          });
      });
    console.log("asdşklASDKL");
  };

  const RefreshData = async () => {
    console.log("refresh");
    const urlToRequest =
      "http://192.168.0.12:3000/user/list/" + userDataStore.id;
    console.log(urlToRequest);
    const res = await axios.get(urlToRequest);
    userDataStore.setTotalCancelled(res.data.total_cancelled);
    userDataStore.setTotalCompleted(res.data.total_completed);
    userDataStore.setTotalSpent(res.data.total_spent);
  };

  return (
    <View style={styles.container}>
      <Pressable>
        <Button title="Logout" onPress={logout} />
      </Pressable>
      <View style={styles.wallet}>
        <Text>Address: {walletShortener(authstore.address)}</Text>
      </View>
      <Text>ID: {userDataStore.id}</Text>
      <Text>Total Cancelled: {userDataStore.total_cancelled}</Text>
      <Text>Total Completed: {userDataStore.total_completed}</Text>
      <Text>Total Spent: {userDataStore.total_spent}</Text>
      <Pressable>
        <Button title="Refresh" onPress={RefreshData} />
      </Pressable>
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
});

export default UserScreen;
