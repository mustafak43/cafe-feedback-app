import React, { useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
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
  Alert,
} from "react-native";
import ProductScreen from "./ProductScreen";
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
import { StatusBar } from "expo-status-bar";
import empty from "./empty";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { server_ip } from "../constants";
import { useUserInfo } from "../constants/globalContext";
import ArrowRightOnRectangleIcon from "react-native-heroicons/outline";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, setUser } = useUserInfo();

  async function handleSubmit() {
    const userData = {
      nickname,
      password,
    };
    
    try {
      setSubmitting(true);

      const res = await axios.post(`${server_ip}/login`, userData);
  
      if (res.status === 200) {
        Alert.alert('Giriş başarılı');
        // AsyncStorage.setItem('token', res.data.jwt);
        // await AsyncStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      console.error('Error:', error);
  
      Alert.alert('Hatalı bilgi');
    }
    setSubmitting(false);
  }

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image
        className=" w-full absolute"
        source={require("../assets/images/beansBackground1.png")}
      />

      {/* title and form */}
      <View className="h-full w-full flex justify-around pt-40 pb-10">
        {/* TİTLE */}
        <View className="flex items-center m-10">
          <Text className="text-amber-800 font-bold tracking-wider text-5xl">
            Giriş Yap
          </Text>
        </View>

        {/* form */}
        <View className="flex items-center mx-4 space-y-1 flex">
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput placeholder="Kullanıcı adı" autoCapitalize="none" placeholderTextColor={"gray"} onChange={e => setNickname(e.nativeEvent.text)}/>
          </View>
          <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput
              placeholder="Şifre"
              autoCapitalize="none"
              placeholderTextColor={"gray"}
              secureTextEntry
              onChange={e => setPassword(e.nativeEvent.text)}
            />
          </View>
          { !submitting &&
          <View className="w-full">
            <TouchableOpacity className="w-full bg-amber-800 p-3 rounded-2xl mb-3">
              <Text
                className="text-xl font-bold text-white text-center"
                onPress={() => handleSubmit()}
              > 
                Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>
          }
          <View className="flex-row justify-center">
            <Text>Bir hesabınız yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text className="text-sky-600">Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
