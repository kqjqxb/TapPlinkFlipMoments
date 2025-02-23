import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';
import { AudioProvider, useAudio } from './src/context/AudioContext';


const Stack = createNativeStackNavigator();

const TapPlinkStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isTapPlinkOnbVisible, setIsTapPlinkOnbVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const [initializingTapPlinkApp, setInitializingTapPlinkApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadPlinkUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedPlinkUser = await AsyncStorage.getItem(storageKey);
        const isOnbWasVisible = await AsyncStorage.getItem('isOnbWasVisible');

        if (storedPlinkUser) {
          setUser(JSON.parse(storedPlinkUser));
          setIsTapPlinkOnbVisible(false);
        } else if (isOnbWasVisible) {
          setIsTapPlinkOnbVisible(false);
        } else {
          setIsTapPlinkOnbVisible(true);
          await AsyncStorage.setItem('isOnbWasVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of cur user', error);
      } finally {
        setInitializingTapPlinkApp(false);
      }
    };
    loadPlinkUser();
  }, [setUser]);

  if (initializingTapPlinkApp) {
    return (
      <View style={{
        backgroundColor: 'rgba(12, 132, 167, 1)',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AudioProvider>
        <Stack.Navigator initialRouteName={isTapPlinkOnbVisible ? 'OnboardingScreen' : 'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </AudioProvider>
    </NavigationContainer>
  );
};


export default TapPlinkStack;
