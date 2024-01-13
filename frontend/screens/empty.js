import React, { useState } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { themeColors } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { server_ip, categories } from '../constants';
import { SelectList } from 'react-native-dropdown-select-list';
import { PlusIcon } from 'react-native-heroicons/solid';

// ÜRÜN EKLEME EKRANI

function Empty() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0]);
    }

  };

  const handleSubmit = async () => {
    
    try {
      setSubmitStatus(true);

      // Create a FormData object
      const formData = new FormData();
      
      // Append fields to the FormData object
      formData.append('name', productName);
      formData.append('description', productDescription);
      formData.append('price', productPrice); // Convert price to a string if necessary productPrice.toString()
      formData.append('category', productCategory);
      
      // Append the image file to the FormData object
      formData.append('image', {
        uri: productImage.uri,
        type: "image/png",
        name: "ahsanavahsana"
      });
      
      // Send a POST request to the backend
      const response = await axios.post(`${server_ip}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      });
      
      console.log("I'm working bruh");
      
      console.log('Product created successfully:', response.data);
    } catch (error) {
      console.error('Error creating product:', error);
    }
    
    setSubmitStatus(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 35,
          marginTop: 75,
          marginBottom: 16,
          textAlign: "center",
          color: themeColors.bgLight,
        }}
      >
        Yeni Ürün
      </Text>
      {productImage && <Image source={{ uri: `${productImage.uri}`}} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="İsmi"
        value={productName}
        onChangeText={setProductName} />
      <TextInput
        style={styles.input}
        placeholder="Tanımı"
        value={productDescription}
        onChangeText={setProductDescription}
        multiline />
      <TextInput
        style={styles.input}
        placeholder="Fiyatı"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric" />
      <SelectList 
        setSelected={(val) => setProductCategory(val)} 
        data={categories} 
        save="value"
        placeholder='Kategorisi'
        search={false}
        boxStyles={{marginBottom: 16}}
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Resim Seç</Text>
      </TouchableOpacity>
      { !submitStatus &&
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.imagePickerText}> KAYDET </Text>
      </TouchableOpacity>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  input: {
    height: 48,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  imagePicker: {
    height: 40,
    width: '100%',
    backgroundColor: themeColors.bgLight,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButton: {
    height: 40,
    width: '100%',
    backgroundColor: '#563C2B', // dark brown
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: 'white',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
    
  },
});

export default Empty;