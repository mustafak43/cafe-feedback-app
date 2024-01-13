import React, { useEffect } from "react";
import { View, Dimensions, Text } from "react-native";
import Carousel from "react-native-snap-carousel";
import CoffeeCard from "./coffeeCard";

const {width, height} = Dimensions.get('window');

export default function CarouselEncapsulator(props)
{
    const {status, data} = props;

    useEffect(() => {
        console.log("status: ", status);
    }, [status]);

    return (
            <View
              className={`overflow-visible flex justify-center flex-1`}
            >
              
              <View>
              { status ? <Text> jaja </Text> : <Text> jojo </Text> }
              </View>
                
            </View>
            
    );
}