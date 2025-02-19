import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Share,
  Animated,
  Easing,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




import SettingsScreen from './SettingsScreen';
import AboutScreen from './AboutScreen';
import MelodiesScreen from './MelodiesScreen';
import GameScreen from './GameScreen';
import FlipAndGuessScreen from './FlipAndGuessScreen';


const fontPoppinsRegular = 'Poppins-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');
  

  const [isLevelsVisible, setIsLevelsVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);

  const [isVibrationEnabled, setVibrationEnabled] = useState(true);
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const [isSoundEnabled, setSoundEnabled] = useState(true);
  const [isMusicEnabled, setMusicEnabled] = useState(true);


  const loadSettings = async () => {
    try {
      const soundValue = await AsyncStorage.getItem('isSoundEnabled');
      const vibrationValue = await AsyncStorage.getItem('isVibrationEnabled');
      const notificationValue = await AsyncStorage.getItem('isNotificationEnabled');
      const musicValue = await AsyncStorage.getItem('isMusicEnabled');

      if (soundValue !== null) setSoundEnabled(JSON.parse(soundValue));
      if (vibrationValue !== null) setVibrationEnabled(JSON.parse(vibrationValue));
      if (notificationValue !== null) setNotificationEnabled(JSON.parse(notificationValue));
      if (musicValue !== null) setMusicEnabled(JSON.parse(musicValue));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };


  useEffect(() => {
    const loadCompletedLevels = async () => {
      try {
        const storedLevels = await AsyncStorage.getItem('completedLevels');
        if (storedLevels !== null) {
          setCompletedLevels(JSON.parse(storedLevels));
        } else {
          const initialLevels = [1];
          await AsyncStorage.setItem('completedLevels', JSON.stringify(initialLevels));
          setCompletedLevels(initialLevels);
        }
      } catch (error) {
        console.error('Failed to load completed levels:', error);
      }
    };

    loadCompletedLevels();
  }, [selectedLevel, selectedScreen]);


  const handleLevelPress = async (lvl) => {
    if (completedLevels.includes(lvl)) {
      setSelectedLevel(lvl);
      setSelectedScreen('Game');
    } else {
      Alert.alert('Level not completed', 'You have not completed this level yet.');
    }
  };

  useEffect(() => {
    loadSettings();
  }, [selectedScreen]);


  useEffect(() => {
    console.log(`isSound is ` + isSoundEnabled)
  }, [isSoundEnabled])


  useEffect(() => {
    setIsLevelsVisible(false);
  }, [selectedScreen]);



  return (
    <ImageBackground
      source={selectedScreen === 'Home' ? require('../assets/images/onboardingBackground.png') : require('../assets/images/homeScreenImageBg.png') }
      style={{ flex: 1, alignItems: 'center', width: '100%' }}
      resizeMode="cover"
    >

      {selectedScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width,
          justifyContent: 'space-between',
        }}>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: dimensions.width * 0.9,
            alignSelf: 'center',
          }}>
            <TouchableOpacity 
              onPress={() => {
                setSelectedScreen('Settings');
              }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: dimensions.height * 0.023,
              borderRadius: dimensions.height * 0.03,
            }}>
              <Image
                source={require('../assets/icons/settingsIcon.png')}
                style={{
                  width: dimensions.height * 0.028,
                  height: dimensions.height * 0.028,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />

            </TouchableOpacity>



            <TouchableOpacity 
              onPress={() => {
                setSelectedScreen('About');
              }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: dimensions.height * 0.023,
              borderRadius: dimensions.height * 0.03,
            }}>
              <Image
                source={require('../assets/icons/infoIcon.png')}
                style={{
                  width: dimensions.height * 0.028,
                  height: dimensions.height * 0.028,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />

            </TouchableOpacity>

          </View>



          <View>

            <TouchableOpacity
              onPress={() => {
                setSelectedScreen('FlipAndGuess');
              }}
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
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
                Flip & Guess
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                
              }}
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: dimensions.height * 0.02,
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
                Tap Plink Race
              </Text>
            </TouchableOpacity>
          </View>





        </SafeAreaView>
      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} isSoundEnabled={isSoundEnabled} setSoundEnabled={setSoundEnabled} selectedScreen={selectedScreen} 
        isVibrationEnabled={isVibrationEnabled} setVibrationEnabled={setVibrationEnabled} isNotificationEnabled={isNotificationEnabled} setNotificationEnabled={setNotificationEnabled}
        isMusicEnabled={isMusicEnabled} setMusicEnabled={setMusicEnabled}
        />
      ) : selectedScreen === 'About' ? (
        <AboutScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'FlipAndGuess' ? (
        <FlipAndGuessScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'Game' ? (
        <GameScreen setSelectedScreen={setSelectedScreen} selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />
      ) : null}
    </ImageBackground>
  );
};

export default HomeScreen;
