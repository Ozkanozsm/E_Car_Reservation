import { Text, View, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Web3 = require("web3");
import { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { backendurl, web3url } from "../../utils/constants";

function MakeReservationScreen({ route, navigation }) {
  const { station } = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [selectedEpoch, setSelectedEpoch] = useState();
  const [resStatus, setResStatus] = useState();
  const [stationAvailable, setStationAvailable] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  let myAccount;

  const checkAvailability = async () => {
    const durationepoch = durationMinutes * 60;
    const data = {
      stationId: station.id,
      startDate: selectedEpoch,
      duration: durationepoch,
    };
    console.log(data);
    const res = await fetch(`${backendurl}/reservation/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resdata = await res.json();
    console.log(resdata);
    const tempavailable = resdata.available === 1 ? true : false;
    let tempMessage;
    if (tempavailable) {
      tempMessage = "Station is available";
    } else {
      tempMessage = "Station is not available";
    }
    Alert.alert(tempMessage, resdata.message);
    console.log(tempavailable);
    if (tempavailable) {
      setEstimatedPrice(resdata.price);
      console.log(resdata.price);
    }
    setStationAvailable(tempavailable);
  };

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

  const sendForPrice = async (data) => {
    const tx = await fetch(backendurl + "/transaction/sendforprice", {
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

  const getPriceOfReservation = async (resHash) => {
    const priceres = await fetch(backendurl + "/reservation/price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationHash: resHash,
      }),
    });
    const json = await priceres.json();
    return json;
  };

  const makeReservation = async () => {
    const web3 = new Web3(web3url);
    const userPkey = await AsyncStorage.getItem("privateKey");
    const pkey = userPkey;
    myAccount = web3.eth.accounts.privateKeyToAccount(pkey);
    const { contractAddress, contractAbi, escrowAddress } =
      await getContractAll();
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    const durationEpoch = durationMinutes * 60;
    const endEpoch = selectedEpoch + durationEpoch;
    const txdata = contract.methods
      .makeReservation(station.wallet, selectedEpoch, endEpoch)
      .encodeABI();
    console.log(0.1);
    console.log(1);
    const rawReservationTx = {
      from: myAccount.address,
      to: contractAddress,
      data: txdata,
    };
    const required = await getTxRequired(rawReservationTx);

    rawReservationTx.gas = required.gas;
    rawReservationTx.nonce = required.nonce;

    const signedTx1 = web3.eth.accounts.signTransaction(rawReservationTx, pkey);
    const serializedReservationTx = (await signedTx1).rawTransaction;
    const result = await sendForContract(serializedReservationTx);
    setResStatus("reservation contract call sent, waiting for confirmation");
    const restxhash = result.receipt.transactionHash;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const priceres = await getPriceOfReservation(restxhash);
    const price = priceres.value;
    const rawPriceTx = {
      from: myAccount.address,
      to: escrowAddress,
      value: Number(web3.utils.toWei(price.toString(), "ether")),
      data: web3.utils.asciiToHex(restxhash),
    };
    const requiredPrice = await getTxRequired(rawPriceTx);
    rawPriceTx.gas = requiredPrice.gas;
    rawPriceTx.nonce = requiredPrice.nonce;
    const signedTx2 = web3.eth.accounts.signTransaction(rawPriceTx, pkey);
    const serializedPriceTx = (await signedTx2).rawTransaction;
    const resultPrice = await sendForPrice(serializedPriceTx);
    const pricetxhash = resultPrice.receipt.transactionHash;
    setResStatus("reservation price and contract call sent, reservation made");
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setSelectedEpoch(date.getTime() / 1000);
    setStationAvailable(false);
    hideDatePicker();
  };

  useEffect(() => {
    console.log(station);
  }, []);

  return (
    <View style={styles.container}>
      <Text>İstasyon: {station.name}</Text>
      <Text>Adres: {station.address}</Text>
      <Text>Slot Sayisi: {station.total_slots}</Text>
      <View style={styles.pricing}>
        <Text>Fiyatlar:</Text>
        <Text>
          {station.pricing[0].start}:00-{station.pricing[0].end}
          :00 {station.pricing[0].price} ETH
        </Text>
        <Text>
          {station.pricing[1].start}:00-{station.pricing[1].end}
          :00 {station.pricing[1].price} ETH
        </Text>
      </View>
      <View>
        <Button
          title="Select Date and Time"
          onPress={showDatePicker}
          color="#a83254"
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          minuteInterval={15}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>

      {selectedDate && (
        <View>
          <Text style={styles.center}>
            {selectedDate.toString().substr(0, 24)}
          </Text>
          <Text style={styles.center}>{durationMinutes} Mins</Text>
          <View style={styles.btngroup}>
            <View style={styles.padyatay}>
              <Button
                color="#a83254"
                title="-15"
                onPress={() => {
                  if (durationMinutes > 15) {
                    setDurationMinutes(durationMinutes - 15);
                    setStationAvailable(false);
                  }
                }}
              />
            </View>
            <View style={styles.padyatay}>
              <Button
                color="#a83254"
                title="+15"
                onPress={() => {
                  setDurationMinutes(durationMinutes + 15);
                  setStationAvailable(false);
                }}
              />
            </View>
          </View>
          <View style={styles.padyataybuyuk}>
            <Button
              title="check availability"
              color="#a83254"
              onPress={async () => {
                await checkAvailability();
              }}
            />
          </View>
        </View>
      )}

      {stationAvailable && (
        <View>
          <Text style={styles.centerbold}>
            Estimated Price: {estimatedPrice}
          </Text>
          <Button
            color="#a83254"
            title="Make Reservation"
            onPress={() => {
              makeReservation();
              setStationAvailable(false);
            }}
          />
        </View>
      )}
      <Text>{resStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerbold: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  padyatay: {
    padding: 5,
  },
  padyataybuyuk: {
    marginHorizontal: 50,
    marginTop: 10,
  },
  btngroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  center: {
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pricing: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MakeReservationScreen;
