import { useState } from "react";
import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";

function LoginScreen() {
  const authstore = useAuthStore();
  const [privateKey, setPrivateKey] = useState("");

  const userPrivateKeySubmit = () => {
    AsyncStorage.setItem("privateKey", privateKey);
    authstore.savePrivateKey(privateKey);
  };

  const GetPKey = () => {
    console.log(authstore.privateKey);
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
        <Pressable>
          <Button title="Login" onPress={userPrivateKeySubmit} />
        </Pressable>
        <Pressable>
          <Button title="GetPKey" onPress={GetPKey} />
        </Pressable>
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
});

export default LoginScreen;
