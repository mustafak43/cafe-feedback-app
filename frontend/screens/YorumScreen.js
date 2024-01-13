import React, { useState } from "react";
import { NavigationContainer, useNavigation, SafeAreaView } from "@react-navigation/native";
import {
  Dimensions,
  LogBox,
  Platform,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { themeColors } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeIcon as HomeOutline,
  HeartIcon as HeartOutline,
  ShoppingBagIcon as BagOutline,
  UserIcon as UserOutline,
  ArrowLeftCircleIcon
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeSolid,
  HeartIcon as HeartSolid,
  ShoppingBagIcon as BagSolid,
  UserIcon as UserSolid,
} from "react-native-heroicons/solid";
import { StatusBar } from "expo-status-bar";
import { inlineStyles } from "react-native-svg";
import StarRating from 'react-native-star-rating-widget';
import { server_ip } from "../constants";
import axios from "axios";

export default function YorumScreen({route}) {
  const {itemName, itemImage, rate, itemId, userId, wantToEdit, actualComment}= route.params;
  const [rating, setRating] = useState(parseFloat(rate).toFixed());
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState(null);

  const navigation = useNavigation();

  const showConfirmDialog = () => {
    return Alert.alert(
      "Emin misiniz?",
      "Yorumu yayınlamak istediğinize emin misiniz?",
      [
        // The "Yes" button
        {
          text: "Evet",
          onPress: () => {
            handleSubmit();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "Hayır",
          onPress: () => {
            console.log("actualComment: ", actualComment);
          }
        },
      ]
    );
  };

  async function handleSubmit()
  {
    const data={
      _userId: userId,
      _productId: itemId,
      updated: new Date(),
      text,
      rate: rating,
    };

    try {
      setSubmitting(true);

      // SHARNIG THE COMMENT FOR THE FIRST TIME
      if (!wantToEdit) {
        const res = await axios.post(`${server_ip}/comments`, data);
        
        if (res.status == 201)
          Alert.alert("Yorum başarıyla paylaşıldı.");
      }
      // EDITING THE COMMENT
      else {
        const res = await axios.post(`${server_ip}/edit/comment/${actualComment._id}`, data);

        if (res.status == 201)
          Alert.alert("Yorum başarıyla düzenlendi.");
      }
    }
    catch (error) {
      console.error('Error:', error);

      Alert.alert("Yorum paylaşılamadı.");
    }

    setSubmitting(false);
  }

  return (
    
    <View className="flex-1 relative" style={{backgroundColor: "#202124"}}>
      
        <View className="mx-4 flex-row justify-between items-center" style={{marginTop: 33, marginBottom: -20}}>
          <TouchableOpacity className=" rounded-full " onPress={()=> navigation.goBack()}>
            <ArrowLeftCircleIcon size="50" strokeWidth={1.2} color="white" />
          </TouchableOpacity>
        </View>
      

      <View style={{justifyContent: "center", alignItems: "center", marginTop: 40}}>

        <Text style={{
          marginBottom: 20,
          color: "white",
        }} className="text-lg font-semibold"> {itemName} </Text>
        <Image source={{uri: `${server_ip}/${itemImage}`}} className="h-40 w-40" style={{marginBottom: 10}}/>

        <StarRating
        rating={rating}
        onChange={setRating}
        enableHalfStar={false}
        color={"#844630"}
        style={{marginTop: 10, marginBottom: 10}}
        />

        <TextInput placeholder="Deneyiminizi anlatın" defaultValue={(wantToEdit ? actualComment.text : "")} placeholderTextColor={"lightgray"} onChange={e => setText(e.nativeEvent.text)}
        multiline style={{
          borderWidth: 1,
          borderColor: "darkgray",
          width: "80%",
          padding: 15,
          color: "white"
        }}/>

      { !submitting &&
      <TouchableOpacity style={styles.container} onPress={() => showConfirmDialog()}>
        <Text style={styles.text}> Yayınla </Text>
      </TouchableOpacity>
      }
      </View>
    </View>
  )
  
}

const styles = StyleSheet.create({
  ratingView : {
    marginTop: 30,
    borderColor: "gray",
    paddingTop:5,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    // No styling for TouchableOpacity to make it transparent
    marginTop: 20
  },
  text: {
    color: "#74a8db",
    fontSize: 14,  // Set your desired font size
    fontWeight: "bold"
  },
});