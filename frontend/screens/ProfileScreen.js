import React, {useState, useEffect} from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import {
  Dimensions,
  LogBox,
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ProductScreen from "../screens/ProductScreen";
import { themeColors } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeIcon as HomeOutline,
  HeartIcon as HeartOutline,
  ShoppingBagIcon as BagOutline,
  UserIcon as UserOutline,
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeSolid,
  HeartIcon as HeartSolid,
  ShoppingBagIcon as BagSolid,
  UserIcon as UserSolid,
} from "react-native-heroicons/solid";
import { useUserInfo } from "../constants/globalContext";
import { server_ip } from "../constants";
import Comment from "../components/comment";
import {ArrowRightOnRectangleIcon, ArrowRightIcon} from "react-native-heroicons/outline";

export default function ProfileScreen() {
  
  const navigation = useNavigation();
  const { user, setUser } = useUserInfo();
  const [commentsList, setCommentsList] = useState([]);

  const fetchData = async () => {
    try {
      // if (commentsList.lengtrateCountsh == 0){
        const response = await fetch(`${server_ip}/commentsByUser/${user._id}`);
        // Use response.json() directly, it will parse the JSON for you
        const productList = await response.json();

        setCommentsList(productList);
    }
    catch( error )
    { 
        console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ backgroundColor: "white" }} className="h-full w-full">
      <View className="flex flex-row items-center">
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 35,
          marginTop: 75,
          marginLeft: 120,
          marginRight: 100,
          textAlign: "center",
          alignItems: "center",
          color: themeColors.bgLight,
        }}
      >
        Profil
      </Text>

      <TouchableOpacity 
        style={{marginTop: 75}}
        onPress={()=> { 
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
        className="bg-white rounded-full">
        <ArrowRightOnRectangleIcon size="40" strokeWidth={2} color={themeColors.bgDark} />
      </TouchableOpacity>
      </View>
      
      <Text
        style={{
          marginTop: 40,
          marginLeft: 15,
          fontWeight: "bold",
          backgroundColor: themeColors.bgLight,
          padding: 15,
          borderRadius: 10,
          marginRight: 15,
          color:"white"
        }}
      >
        İsim : {user?.name}
      </Text>

      <Text
        style={{
          marginTop: 40,
          marginLeft: 15,
          fontWeight: "bold",
          backgroundColor: themeColors.bgLight,
          padding: 15,
          borderRadius: 10,
          marginRight: 15,
          color:"white"
        }}
      >
        Kullanıcı adı : {user?.nickname}
      </Text>

      <Text
        style={{
          marginTop: 40,
          marginLeft: 15,
          fontWeight: "bold",
          backgroundColor: themeColors.bgLight,
          padding: 15,
          borderRadius: 10,
          marginRight: 15,
          color:"white"
        }}
      >
        E-posta : {user?.email}
      </Text>

      <ScrollView>
        <Text
          style={{
            marginTop: 40,
            marginLeft: 15,
            fontWeight: "bold",
            backgroundColor: themeColors.bgLight,
            padding: 15,
            borderRadius: 10,
            marginRight: 15,
            color:"white"
          }}
        >
          Yorumlar :{}
        </Text>
        <View style={{
          marginTop: 10,
          marginHorizontal: 20,
        }}>
          { commentsList.map((item) => ( <Comment key={item._id} item={item} restaurant={true}/> ) )}
        </View>

        </ScrollView>
    </View>
  );
}
