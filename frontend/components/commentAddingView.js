import React, {useState} from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import StarRating from 'react-native-star-rating-widget';
import { useNavigation } from '@react-navigation/native';

const CommentAddingView = (props) => 
{
  const {item, userId, itemId} = props;
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();

  return (
    <View style={styles.ratingView}>
      <Text style={{fontWeight: "bold"}}> Bu ürüne puan verin </Text>
      <Text style={{color: "lightgray"}}> Düşüncelerinizi diğer kişilerle paylaşın </Text>
      <StarRating
        rating={rating}
        onRatingEnd={()=> navigation.navigate('Yorum', {itemName: item.product.name, itemImage: item.product.imagePath, rate:rating, itemId, userId})}
        onChange={setRating}
        enableHalfStar={false}
        color={"#844630"}
        style={{marginTop: 10, marginBottom: 10}}
        starStyle={{marginHorizontal: 14}}
      />

      <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate('Yorum', {itemName: item.product.name, itemImage: item.product.imagePath, rate:rating, itemId, userId})}>
        <Text style={styles.text}> Yorum yazın </Text>
      </TouchableOpacity>
      {/* <TextInput placeholder="Yorum Yap" style={{padding:5,paddingHorizontal:15}} multiline={true} /> */}
     
      
    </View>
  );
}

const styles = StyleSheet.create({
  ratingView : {
    marginTop: 10,
    borderColor: "gray",
    paddingTop:5,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    // No styling for TouchableOpacity to make it transparent
  },
  text: {
    color: "#74a8db",
    fontSize: 14,  // Set your desired font size
    fontWeight: "bold"
  },
});

export default CommentAddingView;