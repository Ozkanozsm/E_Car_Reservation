import { Text, View, StyleSheet, Pressable, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";
const Web3 = require("web3");

function UserScreen({ navigation }) {
  const web3 = new Web3("http://192.168.0.12:7545");
  const willSendAddress = "0xaeb0Dc43f9512faE8095Aa8c00822b80262a9F84";
  const value = web3.utils.toWei("50", "ether");
  const txdata = web3.utils.utf8ToHex("HI FROM RNATIVE");
  const authstore = useAuthStore();
  const logout = () => {
    console.log("logout");
    AsyncStorage.removeItem("privateKey");
    authstore.removePrivateKey();
  };

  const pkeyToAddress = () => {
    const acc = web3.eth.accounts.privateKeyToAccount(authstore.privateKey);
    console.log(acc.address);
    authstore.setAddress(acc.address);
  };

  const getgas = async () => {
    let gas = await web3.eth.estimateGas({
      to: willSendAddress,
      value: value,
    });
    return gas;
  };

  const pkeyToAddr = () => {
    pkeyToAddress();
  };

  const sendTx = () => {
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
  };

  return (
    <View style={styles.container}>
      <Pressable>
        <Button title="Logout" onPress={logout} />
      </Pressable>
      <Text>UserScreen</Text>
      <Pressable>
        <Button title="pkeyToAddr" onPress={pkeyToAddr} />
      </Pressable>
      <Text>{authstore.address}</Text>
      <Pressable>
        <Button title="sendTx" onPress={sendTx} />
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
});

export default UserScreen;
