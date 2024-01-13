import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import { StatusBar } from "expo-status-bar";
import { categories, coffeeItems } from "../constants";
import CoffeeCard from "../components/coffeeCard";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import axios from "axios";
import { server_ip } from "../constants";
import { useGlobal, useProductInfoList } from "../constants/globalContext";
import Carousel from "react-native-snap-carousel";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS == "ios";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("İçecekler");
  const [activeItemsList, setActiveItemsList] = useState([]);
  const [activeItemsFetched, setActiveItemsFetched] = useState(false);

  const { globalList, setGlobalList } = useGlobal();

  const getData = async () => {
    try {

      if (globalList.length == 0){
        const response = await fetch(`${server_ip}/products`);
        // Use response.json() directly, it will parse the JSON for you
        const productList = await response.json();

        setGlobalList(productList);
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // console.log('activeItemsFetched: ', activeItemsFetched);
  }, [activeItemsFetched]);

  useEffect(() => {
    setActiveItemsFetched(true);
  }, [activeItemsList]);

  useEffect( () => {
    const filteredList = globalList.filter(item => item.product.category === activeCategory);
    setActiveItemsList(filteredList);
  }, [activeCategory, globalList]);

  useEffect( () => {
  }, [activeItemsList]);
  
  return (
    <View className="flex-1 relative bg-white" >
      <StatusBar />

      <Image
        source={require("../assets/images/beansBackground1.png")}
        style={{ height: height * 0.2 }}
        className="w-full absolute -top-5 opacity-10"
      />
      <SafeAreaView className={ios ? "-mb-8" : ""}>
       
        <View className="mx-4 flex-row justify-center items-center">
          <View className="flex-row items-center space-x-2">
            <MapPinIcon size="25" color={themeColors.bgLight} />
            <Text
              className="font-semibold text-base"
              style={{ marginRight: 35 }}
            >
              Burdur
            </Text>
          </View>
        </View>
      

        {/* categories */}
        <View className="px-5 mt-6">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.value}
            className="overflow-visible"
            renderItem={({ item }) => {
              isActive = item.value == activeCategory;
              let activeTextClass = isActive ? "text-white" : "text-gray-700";
              return (
                <TouchableOpacity
                  onPress={() => {
                    setActiveCategory(item.value);
                    setActiveItemsFetched(false);
                  }}
                  style={{
                    backgroundColor: isActive
                      ? themeColors.bgLight
                      : "rgba(0,0,0,0.07)",
                  }}
                  className="p-4 px-5 mr-2 rounded-full shadow"
                >
                  <Text className={"font-semibold " + activeTextClass}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>

      {/* coffee cards */}
      
      <View
        className={`overflow-visible flex justify-center flex-1 ${
          ios ? "mt-10" : ""
        }`}
      >
        <View>
          {/* THATS WHERE THE CAROUSEL WILL GO */}
          { !activeItemsFetched ?
          <Text> LOADING </Text> : 
          <Carousel
            useScrollView={true}
            loop={true}
            containerCustomStyle={{overflow: 'visible'}}
            data={activeItemsList}
            renderItem={({item})=> <CoffeeCard item={item} />}
            inactiveSlideScale={0.75}
            inactiveSlideOpacity={0.75}
            sliderWidth={width}
            itemWidth={width*0.63}
            slideStyle={{display: 'flex', alignItems: 'center'}}
          />
          }
        </View>
        
      </View>
      
    </View>
    
  );
}