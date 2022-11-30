import { useState } from "react";
import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";
import Web3 from "web3";
import { registerMessage } from "../utils/constants";
import axios from "axios";
import { useUserDataStore } from "../utils/userDataStates";

function LoginScreen() {
  const authStore = useAuthStore();
  const userDataStore = useUserDataStore();
  const [privateKey, setPrivateKey] = useState("");
  const web3 = new Web3();

  const userPrivateKeySubmit = async () => {
    try {
      const address = web3.eth.accounts.privateKeyToAccount(privateKey);
      console.log(address);
      await AsyncStorage.setItem("privateKey", privateKey);

      const res = await axios.post("http://192.168.0.12:3000/user/register", {
        signature: web3.eth.accounts.sign(registerMessage, privateKey)
          .signature,
        address: address.address,
      });
      authStore.savePrivateKey(privateKey);
      authStore.setAddress(address.address);
      userDataStore.setId(res.data.id);
      userDataStore.setTotalCancelled(res.data.total_cancelled);
      userDataStore.setTotalCompleted(res.data.total_completed);
      userDataStore.setTotalSpent(res.data.total_spent);

      console.log(res.data);
    } catch (err) {
      console.log(err);
      alert("Invalid Private Key");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userView}>
        <Text>User Login</Text>
        <TextInput
          placeholder="Private Key"
          value={privateKey}
          onChangeText={(text) => setPrivateKey(text)}
        />
        <View style={styles.pressables}>
          <Pressable>
            <Button title="Login" onPress={userPrivateKeySubmit} />
          </Pressable>
        </View>
      </View>
      <View style={styles.stationView}>
        <Text>Station Login</Text>
        <TextInput placeholder="Private Key" />
      </View>
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
  userView: {
    alignItems: "center",
    justifyContent: "center",
  },
  stationView: {
    alignItems: "center",
    justifyContent: "center",
  },
  pressables: {
    margin: 5,
  },
});

export default LoginScreen;
