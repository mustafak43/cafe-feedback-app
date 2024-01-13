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
import Feather from 'react-native-vector-icons/Feather';
import Error from 'react-native-vector-icons/MaterialIcons';
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
import { AlignLeft } from "react-native-feather";
import axios from "axios";
import { server_ip } from "../constants";

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [nickname, setNickname] = useState('');
  const [nicknameVerify, setNicknameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  function handelSubmit() {
    const userData = {
      name: name,
      nickname,
      email,
      password,
    };
    if (nameVerify && emailVerify && passwordVerify && nicknameVerify) {
      axios
        .post(`${server_ip}/signup`, userData)
        .then(res => {
          
          if (res.status === 201) {
            Alert.alert('Kayıt başarılı!');
            navigation.navigate('Login');
          } else {
            Alert.alert(JSON.stringify(res.data));
          }
        })
        .catch(e => console.log(e));
    } else {
      Alert.alert('Zorunlu yerleri doldurunuz.');
    }
  }

  function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(false);

    if (nameVar.length > 2) {
      setNameVerify(true);
    }
  }
  function handleNickname(e) {
    const nameVar = e.nativeEvent.text;
    setNickname(nameVar);
    setNicknameVerify(false);

    if (nameVar.length > 3) {
      setNicknameVerify(true);
    }
  }
  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
    }
  }
 
  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
  }
  
  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image
        className="w-full absolute"
        source={require("../assets/images/beansBackground1.png")}
      />

      {/* title and form */}
      <View className="h-full w-full flex justify-around pt-40 pb-10">
        {/* TİTLE */}
        <View className="flex items-center m-10">
          <Text className="text-amber-800 font-bold tracking-wider text-5xl">
            Kayıt Ol
          </Text>
        </View>

        {/* form */}
        <View className="flex items-center mx-4 space-y-4">
          <View className="bg-amber-800 p-5 rounded-2xl w-full flex-row">
          {nameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
            <TextInput placeholder="İsim" placeholderTextColor={"lightgray"} color={"white"} onChange={e => handleName(e)} style={{flex:1}} />
          </View>
          {name.length < 2 ? null : nameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: '#DC143C',
                fontWeight: 'bold',
              }}>
              İsim 2 karakterden uzun olmalıdır
            </Text>
          )}
          <View className="bg-amber-800 p-5 rounded-2xl w-full flex-row">
          {nicknameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
            <TextInput placeholder="Kullanıcı adı" autoCapitalize="none" placeholderTextColor={"lightgray"} color={"white"} onChange={e => handleNickname(e)} style={{flex:1}} />
          </View>
          {nickname.length < 3 ? null : nicknameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: '#DC143C',
                fontWeight: 'bold',
              }}>
              Kullanıcı adı 3 karakterden uzun olmalıdır
            </Text>
          )}
          <View className="bg-amber-800 p-5 rounded-2xl w-full flex-row">
          { emailVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
            <TextInput placeholder="E-Posta" autoCapitalize="none" placeholderTextColor={"lightgray"} color={"white"} onChange={e => handleEmail(e)} style={{flex:1}}/>

          </View>
          {email.length < 1 ? null : emailVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: '#DC143C',
                fontWeight: "bold",
              }}>
              Doğru e-posta adresi giriniz
            </Text>
          )}
          <View className="bg-amber-800 p-5 rounded-2xl w-full mb-3 flex-row">
            <TextInput
              placeholder="Şifre"
              autoCapitalize="none"
              placeholderTextColor={"lightgray"}
              color={"white"}
              onChange={e => handlePassword(e)}
              secureTextEntry={!showPassword}
              style={{flex:1}}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : !showPassword ? (
                <Feather
                  name="eye-off"
                  style={{marginRight: -10}}
                  color={passwordVerify ? 'green' : 'red'}
                  size={23}
                />
              ) : (
                <Feather
                  name="eye"
                  style={{marginRight: -10}}
                  color={passwordVerify ? 'green' : 'red'}
                  size={23}
                />
              )}
            </TouchableOpacity>
          </View>
          {password.length < 1 ? null : passwordVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: '#DC143C',
                fontWeight: 'bold',
              }}>
              Büyük harf, küçük harf, sayı ve 6 veya daha fazla karakter içermeli.
            </Text>
          )}
          <View className="w-full">
            <TouchableOpacity className="w-full bg-amber-800 p-3 rounded-2xl mb-3">
              <Text
                className="text-xl font-bold text-white text-center"
                onPress={() => handelSubmit()}
              >
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text>Zaten bir hesabınız var mı? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-sky-600">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
