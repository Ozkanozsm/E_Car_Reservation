import { Text, View, StyleSheet, Pressable, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/authStates";

function UserScreen({ navigation }) {
  const authstore = useAuthStore();
  const logout = () => {
    console.log("logout");
    AsyncStorage.removeItem("privateKey");
    authstore.removePrivateKey();
  };

  return (
    <View style={styles.container}>
      <Pressable>
        <Button title="Logout" onPress={logout} />
      </Pressable>
      <Text>UserScreen</Text>
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
