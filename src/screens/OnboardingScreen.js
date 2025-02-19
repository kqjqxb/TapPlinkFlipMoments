import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fontPoppinsRegular = 'Poppins-Regular';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);



  return (
    <ImageBackground source={require('../assets/images/onboardingBackground.png')} style={{ 
      flex: 1, 
      height: dimensions.height,
      width: dimensions.width, 
    }}>

      <SafeAreaView
        style={{ 
          justifyContent: 'flex-end', 
          flex: 1, 
          alignItems: 'center', 
          
        }}
      >
        
        <View style={{
          alignItems: 'center',
          zIndex: 0,
          width: dimensions.width * 0.93,
          alignSelf: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: dimensions.width * 0.05,
          paddingVertical: dimensions.height * 0.025,
          paddingBottom: dimensions.height * 0.03,
          
        }}>
          <Text
            style={{
              fontFamily: fontPoppinsRegular,
              textAlign: "left",
              fontSize: dimensions.width * 0.046,
              alignSelf: 'center',
              fontWeight: 500,
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              
            }}
          >
            Welcome to Tap Plink Flip Moments! 🚀{'\n'}
          </Text>
          <Text
            style={{
              fontFamily: fontPoppinsRegular,
              fontSize: dimensions.width * 0.041,
              paddingHorizontal: 21,
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'left',
              fontWeight: 300,
            }}>
            Get ready for a game full of speed, fun, and challenges! Whether you're racing against time or guessing words with friends, Tap Plink Flip Moments will keep you on your toes!"{'\n'}🔹Fast-paced solo and party modes{'\n'}🔹Challenge yourself or play with friends{'\n'}🔹Tap, flip, and race your way to victory!
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.replace('Home');
          }}
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: dimensions.height * 0.03,
            borderRadius: dimensions.width * 0.5,
            paddingVertical: dimensions.width * 0.03,
            width: dimensions.width * 0.93,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            
          }}
        >
          <Text
            style={{ 
              fontFamily: fontPoppinsRegular,
              color: 'white', 
              fontSize: dimensions.width * 0.048, 
              textAlign: 'center', 
              fontWeight: 600,
              textTransform: 'uppercase',
              padding: dimensions.width * 0.01,
            }}>
            Start
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    </ImageBackground>
  );
};

export default OnboardingScreen;
