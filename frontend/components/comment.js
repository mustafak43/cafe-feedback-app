import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { UserIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { useGlobal } from "../constants/globalContext";
import { useNavigation } from '@react-navigation/native';

export default function Comment({item, restaurant, yourComment, actualItem, userId})
{

    const [actualDate, setActualDate] = useState('dd.mm.yyyy');
    const navigation = useNavigation();
    const { globalList, setGlobalList } = useGlobal();

    const convertDateFormat = (inputString) => {
        // Parse the input string into a Date object
        const date = new Date(inputString);

        // Extract the day, month, and year components
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
      
        // Assemble the formatted date string
        const formattedDate = `${day}.${month}.${year}`;

        setActualDate(formattedDate);
    };

    useEffect(() => {
        convertDateFormat(item.updated);
    }, []);


     {/* containing whole comment view */}
    return(
        <View>
            {/* containing the avatar and the nickname [maybe the 3 dot too (for editing)] */}
            <View className="flex-row" style={{alignItems: "center", marginBottom: 10, marginLeft: 3}}>
                {/* <Image source={{uri: ``}} style={styles.circularImage} /> */}
                <View style={styles.circularImage}><UserIcon size="32" color={"#D7D8DA"}/></View>
                <Text style={{marginLeft: 10}}> {item.username} </Text>
                { restaurant &&
                  <TouchableOpacity style={styles.container} onPress={()=> {
                    let myProduct = null;
                    globalList.forEach(p => {
                      if (p.product.name == item.productName)
                      {
                        myProduct = p;
                        console.log("myProduct: ", myProduct);
                      }
                    });

                    if (myProduct != null)
                      navigation.navigate('Product', myProduct);
                  }}>
                    <Text style={styles.text}> {item.productName} </Text>
                  </TouchableOpacity>
                }
            </View>
            {/* containing the rating and the date */}
            <View className="flex-row" style={{alignItems: "center", marginLeft: 3, marginBottom: 5}}>
                <StarRatingDisplay
                rating={item.rate}
                color={"#844630"}
                starSize={16}
                starStyle={{marginHorizontal: 0}}
                />
                <Text style={{fontSize: 11, marginLeft: 2}}> {actualDate} </Text>
            </View>

            {/* containing the text */}
            <View style={{marginBottom: 10, marginLeft: 3}}>
                <Text>{item.text}</Text>
            </View>

            { yourComment &&
              <TouchableOpacity style={styles.editButton} onPress={()=> {navigation.navigate('Yorum', {itemName: actualItem.product.name, itemImage: actualItem.product.imagePath, rate:item.rate, itemId: actualItem.product._id, userId, wantToEdit: true, actualComment: item})}}>
                <Text style={styles.text}> Yorumunuzu düzenleyin </Text>
              </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    productInProfile: {
        fontSize: 14,  // Set your desired font size
        fontWeight: '700',
        marginHorizontal: 80,
        color: themeColors.bgDark,
    },
    text: {
        color: "#74a8db",
        fontSize: 14,  // Set your desired font size
        fontWeight: '500',
      },
    circularImage: {
      width: 40, // Adjust the width as needed
      height: 40, // Adjust the height as needed
      borderRadius: 20, // Half of the width and height to create a circle
      paddingTop: 11,
      backgroundColor: "#6D767B",
      alignItems: "center",
      justifyContent: "center",
    },
  });