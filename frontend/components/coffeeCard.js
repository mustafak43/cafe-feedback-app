import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { StarIcon } from 'react-native-heroicons/solid';
import { PlusIcon, ChatBubbleBottomCenterTextIcon as CommentIcon } from 'react-native-heroicons/outline';
import { useGlobal } from '../constants/globalContext';
import { server_ip } from '../constants';
const {width, height} = Dimensions.get('window');
const ios = Platform.OS == 'ios';

export default function CoffeeCard({item}) {
  const navigation = useNavigation();

  return (
      <View
        style={{
          borderRadius: 40, 
          backgroundColor: themeColors.bgDark, 
          height: ios? height*0.4 : height*0.50, 
          width: width*0.65,
        }} 
        >
        <View
        style={{
          shadowColor: 'black',
          shadowRadius: 30,
          shadowOffset: {width: 0, height: 40},
          shadowOpacity: 0.8,
          elevation: 10,
          marginTop: ios? -(height*0.08): 15,
        }}
        className={"flex-row justify-center -mt-14"}>
          <Image 
            source={{uri: `${server_ip}/${item?.product?.imagePath}`}}
            className="h-40 w-40"
          />
        </View>
          <View className={`px-5 flex-1 justify-between ${ios? 'mt-5': ''}`}>
            <View className="space-y-3 mt-3">
              <Text className="text-3xl text-white font-semibold z-10">
                {item?.product?.name ?? 'no name'}
              </Text>
              <View style={{backgroundColor: 'rgba(255,255,255,0.2)'}} 
                className="flex-row items-center rounded-3xl p-1 px-2 space-x-1 w-16">
                <StarIcon size="15" color="white" />
                <Text className="text-base font-semibold text-white">{item?.product?.rate ?? '0'}</Text>
              </View>
              
            </View>
            

            <View style={{
              backgroundColor: ios? themeColors.bgDark: 'transparent',
              shadowColor: themeColors.bgDark,
              shadowRadius: 25,
              shadowOffset: {width: 40, height: 40},
              shadowOpacity: 1,
              elevation: 10,
            }} className="flex-row justify-between items-center mb-5">
              <Text className="text-white font-bold text-lg"> {item?.product?.price ?? 'no price'} ₺</Text>
              <TouchableOpacity 
              onPress={()=> { if (item?.product != null) navigation.navigate('Product', {...item}); }}
              style={{
                shadowColor: 'black',
                shadowRadius: 40,
                shadowOffset: {width: -20, height: -10},
                shadowOpacity: 1,
              }} className="p-4 bg-white rounded-full">
                <CommentIcon size="25" strokeWidth={2} color={themeColors.bgDark} />
              </TouchableOpacity>
            </View>
            
            
          </View>

      </View>
    
  )
}