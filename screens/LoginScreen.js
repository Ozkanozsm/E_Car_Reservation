import { useState } from "react";
import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";
import Web3 from "web3";
import { backendurl, registerMessage } from "../utils/constants";
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

      const res = await axios.post(`${backendurl}/user/register`, {
        signature: web3.eth.accounts.sign(registerMessage, privateKey)
          .signature,
        address: address.address,
      });
      await AsyncStorage.setItem("privateKey", privateKey);
      console.log(res.data);
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

  const stationLogin = () => {
    authStore.setIsStation(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userView}>
        <Text style={styles.logintext}>User Login</Text>
        <TextInput
          style={styles.marginbot}
          placeholder="Private Key"
          value={privateKey}
          secureTextEntry={true}
          onChangeText={(text) => setPrivateKey(text)}
        />
        <View style={styles.pressables}>
          <Pressable>
            <Button
              color={"#a83254"}
              title="Login"
              onPress={userPrivateKeySubmit}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.stationView}>
        <Text style={styles.logintext}>Station Login</Text>
        <Button
          title="Login"
          color={"#a83254"}
          onPress={() => {
            stationLogin();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  marginbot: {
    marginBottom: 10,
    textAlign: "center",
  },
  logintext: {
    fontSize: 20,
    marginBottom: 10,
  },
  userView: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 150,
    marginBottom: 70,
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
