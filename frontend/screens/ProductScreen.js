import { View, Text, TouchableOpacity, Image, Dimensions, Platform, TextInput, Button, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftCircleIcon, MinusIcon, PlusIcon, PhotoIcon, PencilIcon } from 'react-native-heroicons/outline';
import { HeartIcon, StarIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../theme';
import { ShoppingBag } from 'react-native-feather';
import {createStackNavigator} from '@react-navigation/stack'  
import CommentAddingView from '../components/commentAddingView';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server_ip } from '../constants';
import { useUserInfo } from '../constants/globalContext';
import Comment from '../components/comment';
import axios from 'axios';

const {width, height} = Dimensions.get('window');
const ios = Platform.OS == 'ios';

const progressWidth = 200;

export default function FavouriteScreen(props) {
  const item = props.route.params;
  const navigation = useNavigation();
  const { user, setUser } = useUserInfo();
  const [commentsList, setCommentsList] = useState([]);
  const [avgRate, setAvgRate] = useState(0);
  const [progressValues, setProgressValues] = useState({});
  const [hasComment, setHasComment] = useState(false);
  const [myCommentOnTheProduct, setMyCommentOnTheProduct] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updatedField, setUpdatedField] = useState('');

  const [editingImage, setEditingImage] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);

  const [nameToEdit, setNameToEdit] = useState(item.product.name);
  const [priceToEdit, setPriceToEdit] = useState(item.product.price);
  const [aboutToEdit, setAboutToEdit] = useState(item.product.description);

  const editNameRef = useRef(null);
  const editPriceRef = useRef(null);
  const editAboutRef = useRef(null);

  const getData = async () => {
    try {
      // if (commentsList.lengtrateCountsh == 0){
        const response = await fetch(`${server_ip}/commentsByProduct/${item.product._id}`);
        // Use response.json() directly, it will parse the JSON for you
        const productList = await response.json();

        // Step 1: Extract Rate Values
        const rateValues = productList.map(comment => comment.rate);

        // Step 2: Calculate Average
        const averageRate = rateValues.length > 0
          ? rateValues.reduce((sum, rate) => sum + rate, 0) / rateValues.length
          : 0;

        setAvgRate(averageRate);

        const rateCounts = {};
        // Loop through each comment
        productList.forEach(comment => {
          const rate = comment.rate;

          // Check if the rate is a valid value (between 1 and 5)
          if (rate >= 1 && rate <= 5) {
            // Increment the count for the corresponding rate
            rateCounts[rate] = (rateCounts[rate] || 0) + 1;
          }
        });

        const totalComments = productList.length;
        Object.keys(rateCounts).forEach(rate => {
          rateCounts[rate] = Number((rateCounts[rate] / totalComments).toFixed(1));
        });

        setProgressValues(rateCounts);

        // Find the index of the object with the specified field value
        const indexToDelete = productList.findIndex(item => item.username == user.nickname);

        const theCommentIs = productList[indexToDelete];

        setMyCommentOnTheProduct(theCommentIs);

        if (indexToDelete !== -1){
          // If the object is found, remove it from the list
          productList.splice(indexToDelete, 1);
          setHasComment(true);
        }
        else {
          setHasComment(false);
        }

        setCommentsList(productList);

      // }

    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit()
  {
    const data={
      updatedField,
      updatedValue,
      productName: item.product.name,
    };

    try {
      setSubmitting(true);
      


      const res = await axios.post(`${server_ip}/edit/product/${item.product._id}`, data);


      
    }
    catch (error) {
      console.error('Error:', error);

      Alert.alert("Ürün düzenlenemedi.");
    }

    setSubmitting(false);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <ScrollView className="flex-1" style={{backgroundColor: "#e6e6e6"}}>
      
      <StatusBar style="light" />
      <Image 
        source={require('../assets/images/beansBackground2.png')}
        style={{height: 250, borderBottomLeftRadius: 50, borderBottomRightRadius: 50}} 
        className="w-full absolute" />
      
      <SafeAreaView className="space-y-4 flex-1">
        <View className="mx-4 flex-row justify-between items-center">
          <TouchableOpacity className=" rounded-full " onPress={()=> navigation.goBack()}>
            <ArrowLeftCircleIcon size="50" strokeWidth={1.2} color="white" />
          </TouchableOpacity>
        </View>

        
        <View 
          style={{
            shadowColor: themeColors.bgDark,
            shadowRadius: 30,
            shadowOffset: {width: 0, height: 30},
            shadowOpacity: 0.9,
          }}
          className="flex-row justify-center">
          <Image source={{uri: `${server_ip}/${item.product.imagePath}`}}className="h-60 w-60" style={{marginTop: ios? 0:0}} />

          { user != null && user.nickname == 'admin' && !editingImage &&
          <TouchableOpacity className=" rounded-full " onPress={() => {
            // DÜZENLE IMAGE AXIOS POST if new image is clicked
            // if not you gotta save the image in a variable ig? idk and when cancel is pressed you gotta revert back the changes
          }} 
          style={{
            width: 50,
            height: 50,
            borderRadius: 50, // half of the width and height to make it a circle
            borderWidth: 2,
            borderColor: themeColors.text, // color of the circle border
            justifyContent: 'center',
            alignItems: 'center',
            top: 190,
            position: 'absolute',
            right: 80,
            backgroundColor: "#ededed",
          }}>
            <PhotoIcon size="40" strokeWidth={1.2} color={themeColors.text} style={{position: 'absolute', right: 3}}/>
          </TouchableOpacity>
          }

        </View>
        
 
        {/* header kinda thing Cappucino and ₺ */}
        <View className="px-4 flex-row items-center">
          
          <View>
          <View className="flex-row items-center">
            <TextInput ref={editNameRef} style={{color: themeColors.text, fontWeight: 'bold', fontSize: 30}} value={nameToEdit} editable={editingName}/>
            { user != null && user.nickname == 'admin' && !editingName &&
            <TouchableOpacity className=" rounded-full " style={{marginHorizontal: 10}} 
            onPress={() => {
              setEditingName(true);
              setTimeout(() => editNameRef.current.focus(), 0);
            }}>
              <PencilIcon size="25" strokeWidth={1.2} color={themeColors.text}/>
            </TouchableOpacity>
            }
          </View>
          {
            editingName &&
            <View className="flex-row">
              <TouchableOpacity style={{
                borderWidth: 1,
                borderRadius: 4,
                alignSelf: 'flex-start',
                padding: 2,
                marginVertical: 8,
              }} onPress={() => {
                // DÜZENLE YANİ AXIOS POST
              }}>
                <Text style={{color: themeColors.text}}>Düzenle</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{
                borderWidth: 1,
                borderRadius: 4,
                alignSelf: 'flex-start',
                padding: 2,
                marginVertical: 8,
                marginHorizontal: 10,
              }} onPress={() => {
                const n = item.product.name;
                setNameToEdit("jaja jojo");

                setEditingName(false);
              }}>
                <Text style={{color: themeColors.text}}>İptal</Text>
              </TouchableOpacity>
            </View>
          }
          </View>

          <TextInput ref={editPriceRef} style={{color: themeColors.text, fontWeight: 'bold', fontSize: 20, textAlign: 'right', flex: 1}} defaultValue={item.product.price.toString()} editable={editingPrice}/>
          <Text style={{color: themeColors.text}} className="text-lg font-semibold"> ₺</Text>
          { user != null && user.nickname == 'admin' && !editingPrice &&
          <TouchableOpacity className=" rounded-full " style={{marginHorizontal: 10}} 
          onPress={() => {
            setEditingPrice(true);
            setTimeout(() => editPriceRef.current.focus(), 0);
          }}>
            <PencilIcon size="20" strokeWidth={1.2} color={themeColors.text}/>
          </TouchableOpacity>
          }
        </View>

        <View className="px-4 flex-row items-center">
          <Text style={{color: themeColors.text}} className="text-lg font-bold">Hakkında</Text>
          { user != null && user.nickname == 'admin' && !editingAbout &&
          <TouchableOpacity className=" rounded-full " style={{marginHorizontal: 10}} 
          onPress={() => {
            setEditingAbout(true);
            setTimeout(() => editAboutRef.current.focus(), 0);
          }}>
            <PencilIcon size="20" strokeWidth={1.2} color={themeColors.text}/>
          </TouchableOpacity>
          }
        </View>
        <View className="px-4">
          <TextInput ref={editAboutRef} style={{color: '#4b5563'}} defaultValue={item.product.description} editable={editingAbout} multiline/>
        </View>
      </SafeAreaView>
      
      
      { !hasComment ?
      <CommentAddingView item={item} itemId={item.product._id} userId={user._id}></CommentAddingView> :
      <View style={{
        marginTop: 20,
        marginHorizontal: 22,
      }}>
        <Comment item={myCommentOnTheProduct} actualItem={item} userId={user._id} restaurant={false} yourComment={true}/>
      </View>
      }

      <View style={{marginHorizontal: 10}}>
      <View className="px-4 space-y-2">
        <Text style={{color: themeColors.text, fontWeight: '500'}} className="text-base mt-5">Puanlar ve yorumlar</Text>
      </View>
      {/* includes left and right side of the puan ve yorum */}
      <View className="flex flex-row">
        {/* includes left part with puan and stars */}
        <View>
          <Text style={{fontSize: 50, color: themeColors.text}}> { avgRate.toFixed(1).replace('.', ',')} </Text>
          <View style={{marginLeft: 12}} >
            <StarRatingDisplay
              rating={avgRate}
              color={"#844630"}
              starSize={16}
              starStyle={{marginHorizontal: 0}}
            />
          </View>
          <Text style={{fontSize: 11, color: "gray", marginLeft: 10,}}> {commentsList.length + (hasComment ? 1 : 0)} </Text>
        </View>
        {/* includes right part with progress bars on top of each other */}
        <View className="ml-5 mt-3" style={{alignItems: 'center'}}>
          <View className="flex-row" style={{alignItems: 'center'}}>
            {/* includes right side with 5 status bars on top of each other */}
            <Text style={{fontSize: 12, marginRight: 4}}> 5 </Text>
            <Progress.Bar progress={progressValues['5']} width={progressWidth} color='#74a8db' unfilledColor='#ededed' borderRadius={6} borderWidth={0} height={10}/>
          </View>
          <View className="flex-row" style={{alignItems: 'center'}}>
            {/* includes right side with 5 status bars on top of each other */}
            <Text style={{fontSize: 12, marginRight: 4}}> 4 </Text>
            <Progress.Bar progress={progressValues[4]} width={progressWidth} color='#74a8db' unfilledColor='#ededed' borderRadius={6} borderWidth={0} height={10}/>
          </View>
          <View className="flex-row" style={{alignItems: 'center'}}>
            {/* includes right side with 5 status bars on top of each other */}
            <Text style={{fontSize: 12, marginRight: 4}}> 3 </Text>
            <Progress.Bar progress={progressValues[3]} width={progressWidth} color='#74a8db' unfilledColor='#ededed' borderRadius={6} borderWidth={0} height={10}/>
          </View>
          <View className="flex-row" style={{alignItems: 'center'}}>
            {/* includes right side with 5 status bars on top of each other */}
            <Text style={{fontSize: 12, marginRight: 4}}> 2 </Text>
            <Progress.Bar progress={progressValues[2]} width={progressWidth} color='#74a8db' unfilledColor='#ededed' borderRadius={6} borderWidth={0} height={10}/>
          </View>
          <View className="flex-row" style={{alignItems: 'center'}}>
            {/* includes right side with 5 status bars on top of each other */}
            <Text style={{fontSize: 12, marginRight: 4}}> 1 </Text>
            <Progress.Bar progress={progressValues[1]} width={progressWidth} color='#74a8db' unfilledColor='#ededed' borderRadius={6} borderWidth={0} height={10}/>
          </View>
        </View>
      </View>
      </View>    
      
      {/* COMMENTS TO BE SHOWN AFTER THE 5 BAR AND RATING */}
      <View style={{
        marginTop: 20,
        marginHorizontal: 20,
      }}>
        { commentsList.map((item) => ( <Comment key={item._id} item={item} restaurant={false} /> ) )}
      </View>
      

    </ScrollView>
  )
}