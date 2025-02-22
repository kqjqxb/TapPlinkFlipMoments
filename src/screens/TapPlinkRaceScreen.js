import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'date-fns';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Switch,
  TextInput,
  Alert,
  Modal,
  Animated,
  Easing,
  PanResponder,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import funnyWordsData from '../components/funnyWordsData';
import famousPeopleData from '../components/famousPeopleData';
import moviesAndTVData from '../components/moviesAndTVData';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';


const fontPoppinsRegular = 'Poppins-Regular';

const colorPoints = [
  {
    id: 1,
    pointImage: require('../assets/images/pointsImages/greenPointImage.png'),
    title: 'Green Point'
  },
  {
    id: 2,
    pointImage: require('../assets/images/pointsImages/yellowPointImage.png'),
    title: 'Yellow Point'
  },
  {
    id: 3,
    pointImage: require('../assets/images/pointsImages/redPointImage.png'),
    title: 'Red Point'
  }
]

const TapPlinkRaceScreen = ({ setSelectedScreen, selectedScreen, isVibrationEnabled, isSoundEnabled }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [playersAmount, setPlayersAmount] = useState(2);
  const [players, setPlayers] = useState(Array(playersAmount).fill(''));
  const [isPresentaitonWasVisible, setIsPresentaitonWasVisible] = useState(false);
  const [isGameWasStarted, setIsGameWasStarted] = useState(false);
  const [isGameWasFinished, setIsGameWasFinished] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [randId, setRandId] = useState(1);
  const [generatedRandomColorPoint, setGeneratedRandomColorPoint] = useState(colorPoints[randId]);
  const [scores, setScores] = useState(Array(players.length).fill(0));
  const previousRandomIdRef = useRef(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [leaderBoardModalVisible, setLeaderBoardModalVisible] = useState(false);



  const { volume } = useAudio();
  const sound = 'sound.wav'

  Sound.setCategory('Playback');

  const playSound = (soundFile) => {
    const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
      sound.setVolume(1);
      if (error) {
        console.log('Помилка при завантаженні файлу:', error);
        return;
      }
      sound.play((success) => {
        if (!success) {
          console.log('Помилка при відтворенні звуку');
        }
      });
    });
  };



  const generateRandomColorPoint = () => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * 3) + 1; 
    } while (randomId === previousRandomIdRef.current);

    previousRandomIdRef.current = randomId;
    setGeneratedRandomColorPoint(colorPoints[randomId - 1]);
    setRandId(randomId);
  };

  const showAlert = () => {
    setModalVisible(true);
  };

  const handleExit = () => {
    setModalVisible(false);
    setSelectedScreen('Home');
  };

  const handleStay = () => {
    setModalVisible(false);
  };


  useEffect(() => {
    const loadResults = async () => {
      try {
        const existingResults = await AsyncStorage.getItem('results');
        const results = existingResults ? JSON.parse(existingResults) : [];
        setResults(results);
      } catch (error) {
        console.log('Помилка при завантаженні результатів:', error);
      }
    };

    loadResults();
  }, []);

  const saveResult = async (score) => {
    try {
      const existingResults = await AsyncStorage.getItem('results');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.push(score);
      await AsyncStorage.setItem('results', JSON.stringify(results));
    } catch (error) {
      console.log('Помилка при збереженні результату:', error);
    }
  };

  const handleEndGame = async () => {
    await saveResult(score);
    setIsGameWasFinished(!isGameWasFinished);
    setSelectedScreen('Home');
    setScore(0);
  };




  const rotateValue = useRef(new Animated.Value(0)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (isAnimating.current) {
          resetAnimations();
        }
        isAnimating.current = true;
        startAnimations();
      },
      onPanResponderRelease: () => {
        isAnimating.current = false;
        stopAnimations();
      },
    })
  ).current;

  const startAnimations = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000, // Faster rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateXValue, {
          toValue: dimensions.width * 0.45,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateXValue, {
          toValue: -dimensions.width * 0.45,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateXValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const generatedRandomColorPointRef = useRef(generatedRandomColorPoint);

  useEffect(() => {
    generatedRandomColorPointRef.current = generatedRandomColorPoint;
    console.log("My generatendRandomColorPoint is ", generatedRandomColorPoint);
  }, [generatedRandomColorPoint]);

  const stopAnimations = () => {
    checkPosition(generatedRandomColorPointRef.current);
    rotateValue.stopAnimation();
    translateXValue.stopAnimation();
  };

  const resetAnimations = (point) => {
    rotateValue.setValue(0);
    translateXValue.setValue(0);
    startAnimations(); // Restart animations after resetting values
  };

  const checkPosition = (point) => {
    translateXValue.stopAnimation(value => {
      const thirdWidth = dimensions.width * 0.9 / 3;
      const position = value + dimensions.width * 0.45; // Adjust position to be within 0 to width range

      console.log('\n\n\nHERE LOGS: ', position)
      console.log('Generated Random Color Point ID:', point.id);
      const thisId = point.id;
      console.log('This ID:', thisId);
      console.log('point:', point);
      console.log('Value:', value);
      console.log('Position:', position);
      console.log('Third Width:', thirdWidth);

      if (point) {
        if (thisId === 1 && position <= thirdWidth) {
          if (isSoundEnabled) playSound(sound);
          if (isVibrationEnabled) {
            ReactNativeHapticFeedback.trigger("impactLight", {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
          }
          // Alert.alert('Success', 'You scored a point!');
          setScore((prev) => prev + 1);
          generateRandomColorPoint();
        } else if (thisId === 2 && position > thirdWidth && position <= 2 * thirdWidth) {
          if (isSoundEnabled) playSound(sound);
          if (isVibrationEnabled) {
            ReactNativeHapticFeedback.trigger("impactLight", {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
          }
          // Alert.alert('Success', 'You scored a point!');
          setScore((prev) => prev + 1);
          generateRandomColorPoint();
        } else if (thisId === 3 && position > 2 * thirdWidth) {
          if (isSoundEnabled) playSound(sound);
          if (isVibrationEnabled) {
            ReactNativeHapticFeedback.trigger("impactLight", {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
          }
          // Alert.alert('Success', 'You scored a point!');
          setScore((prev) => prev + 1);
          generateRandomColorPoint();
        } else {
          // Alert.alert('Try Again', 'You missed the target.');
        }
      } else {
        console.log('point is null');
      }
    });
  };


  useEffect(() => {
    console.log("My generatendRandomColorPoint is ", generatedRandomColorPoint)
  }, [generatedRandomColorPoint])

  useEffect(() => {
    generateRandomColorPoint();
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getTopResults = () => {
    if (results.length === 0) {
      return <Text style={{
        textAlign: 'center',
        fontFamily: fontPoppinsRegular,
        fontSize: dimensions.width * 0.055,
        paddingHorizontal: dimensions.width * 0.07,
        alignSelf: 'center',
        fontWeight: 600,
        color: 'white',
        textTransform: 'uppercase'
      }}>You don't have results yet</Text>;
    }

    const sortedResults = [...results].sort((a, b) => b - a);
    const topResults = sortedResults.slice(0, 3);

    return topResults.map((result, index) => (
      <View key={index}>
        <Text
          style={{
            fontFamily: fontPoppinsRegular,
            textAlign: "center",
            fontSize: dimensions.width * 0.053,
            padding: dimensions.height * 0.01,
            alignSelf: 'center',
            fontWeight: 600,
            color: 'white',
            textTransform: 'uppercase',


          }}
        >
          {index === 0 ? '🏆' : ''}Score:
        </Text>
        <Text style={{
          textAlign: 'center',
          fontFamily: fontPoppinsRegular,
          fontSize: dimensions.width * 0.055,
          paddingHorizontal: dimensions.width * 0.07,
          alignSelf: 'center',
          fontWeight: 600,
          color: 'white',
          textTransform: 'uppercase'
        }}>
          {result} points
        </Text>
      </View>
    ));
  };



  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',

      flex: 1
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
            if (isPresentaitonWasVisible) {
              showAlert();
            } else setSelectedScreen('Home');
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: dimensions.height * 0.023,
            borderRadius: dimensions.height * 0.03,
          }}>
          <Image
            source={require('../assets/icons/homeIcon.png')}
            style={{
              width: dimensions.height * 0.028,
              height: dimensions.height * 0.028,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />

        </TouchableOpacity>


        <Text
          style={{
            fontFamily: fontPoppinsRegular,
            textAlign: "center",
            fontSize: dimensions.width * 0.053,
            padding: dimensions.height * 0.01,
            right: dimensions.width * 0.0088,
            alignSelf: 'center',
            fontWeight: 600,
            color: 'white',
            textTransform: 'uppercase'

          }}
        >
          Tap Plink Race
        </Text>

        <TouchableOpacity
          onPress={() => {
            setLeaderBoardModalVisible(true);
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: dimensions.height * 0.023,
            borderRadius: dimensions.height * 0.03,
          }}>
          <Image
            source={require('../assets/icons/leadersIcon.png')}
            style={{
              width: dimensions.height * 0.028,
              height: dimensions.height * 0.028,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />

        </TouchableOpacity>

      </View>


      {!isPresentaitonWasVisible && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: dimensions.height * 0.023,
            borderRadius: dimensions.height * 0.035,
            paddingHorizontal: dimensions.width * 0.055,
            width: dimensions.width * 0.9,
            marginTop: dimensions.height * 0.03,
          }}>
          <Text style={{
            color: 'white',
            fontSize: dimensions.width * 0.044,
            fontFamily: fontPoppinsRegular,
            fontWeight: 400,
          }}>
            Welcome to Tap Plink Flip Moments! A fast-paced challenge where speed and precision matter. Get ready to tap your way to victory!
          </Text>

        </View>
      )}


      {!isPresentaitonWasVisible && !isGameWasStarted ? (
        <>
          <Text
            style={{
              fontFamily: fontPoppinsRegular,
              textAlign: "center",
              fontSize: dimensions.width * 0.07,
              padding: dimensions.height * 0.01,
              alignSelf: 'center',
              fontWeight: 600,
              color: 'white',
              textTransform: 'uppercase',
              marginTop: dimensions.height * 0.19

            }}
          >
            Go! Tap as fast as you can!
          </Text>


        </>
      ) : (
        <View {...panResponder.panHandlers} style={{ flex: 1 }}>
          <Image
            source={generatedRandomColorPoint.pointImage}
            style={{
              width: dimensions.height * 0.07,
              height: dimensions.height * 0.07,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.05,
            }}
            resizeMode='contain'
          />
          <Animated.Image
            source={require('../assets/images/triangleImage.png')}
            style={{
              width: dimensions.width * 0.8,
              height: dimensions.width * 0.8,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.1,
              transform: [{ rotate }],
            }}
            resizeMode='contain'
          />
          <Animated.Image
            source={require('../assets/images/lineTriangleImage.png')}
            style={{
              width: dimensions.height * 0.025,
              height: dimensions.height * 0.025,
              alignSelf: 'center',
              position: 'absolute',
              bottom: dimensions.height * 0.08,
              zIndex: 1,
              transform: [{ translateX: translateXValue }],
            }}
            resizeMode='contain'
          />
          <Image
            source={require('../assets/images/colorLineImage.png')}
            style={{
              width: dimensions.width * 0.9,
              height: dimensions.height * 0.02,
              alignSelf: 'center',
              position: 'absolute',
              bottom: dimensions.height * 0.07,
              zIndex: 0,
            }}
            resizeMode='contain'
          />
        </View>
      )}



      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: dimensions.height * 0.07,
        width: dimensions.width * 0.9,
      }}>




        {!isPresentaitonWasVisible && (

          <TouchableOpacity
            onPress={() => {
              // generateRandomColorPoint();
              if (!isPresentaitonWasVisible && !isGameWasStarted) {
                setIsPresentaitonWasVisible(true);
              } else setIsGameWasStarted(true);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: dimensions.height * 0.021,
              borderRadius: dimensions.height * 0.035,
              paddingHorizontal: dimensions.width * 0.055,
              maxWidth: dimensions.width * 0.9,
              flex: 1,
              marginTop: dimensions.height * 0.03,
            }}>
            <Text
              style={{
                fontFamily: fontPoppinsRegular,
                textAlign: "center",
                fontSize: dimensions.width * 0.053,

                alignSelf: 'center',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',

              }}
            >
              Start Race
            </Text>
          </TouchableOpacity>
        )}

      </View>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="light"
            blurAmount={7}
            reducedTransparencyFallbackColor="white"
          />
          <View style={{
            width: dimensions.width * 0.8,
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.05,
            paddingTop: dimensions.width * 0.07,
            paddingHorizontal: 0,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <Text style={{
              marginBottom: dimensions.height * 0.016,
              textAlign: 'center',
              fontFamily: fontPoppinsRegular,
              fontSize: dimensions.width * 0.043,
              paddingHorizontal: dimensions.width * 0.07,
              alignSelf: 'center',
              fontWeight: 600,
            }}>
              Back to Menu
            </Text>
            <Text style={{
              marginBottom: dimensions.height * 0.016,
              textAlign: 'center',
              fontFamily: fontPoppinsRegular,
              fontSize: dimensions.width * 0.032,
              paddingHorizontal: dimensions.width * 0.07,
            }}>
              Are you sure you want to leave? Your current player setup will be lost
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: dimensions.width * 0.8,
              borderTopColor: '#3C3C435C',
              borderTopWidth: dimensions.width * 0.0019,
              paddingHorizontal: dimensions.width * 0.07,
            }}>

              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  paddingVertical: dimensions.height * 0.02,
                  width: '44%',
                }}
                onPress={() => {
                  setModalVisible(false);
                  setIsGameWasFinished(true);
                }}
              >
                <Text style={{
                  color: '#260338',
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  fontWeight: 400,
                }}>
                  Exit to Menu
                </Text>
              </TouchableOpacity>
              <View style={{
                borderLeftColor: '#3C3C435C',
                borderLeftWidth: dimensions.width * 0.0019,
                height: '100%',
                paddingVertical: dimensions.height * 0.02,
              }} />
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: dimensions.height * 0.02,
                  width: '44%',
                }}
                onPress={handleStay}
              >
                <Text style={{
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: '#0C84A7'
                }}>
                  Stay here
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>




      <Modal
        animationType="fade"
        transparent={true}
        visible={isGameWasFinished}
        onRequestClose={() => {
          setIsGameWasFinished(!isGameWasFinished);
        }}
      >
        <SafeAreaView style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="light"
            blurAmount={30}
            reducedTransparencyFallbackColor="white"
          />
          <TouchableOpacity
            onPress={() => {
              handleEndGame();
            }}
            style={{
              width: dimensions.width,
              height: dimensions.height,

              borderRadius: dimensions.width * 0.05,

              paddingHorizontal: 0,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <SafeAreaView style={{
              flex: 1,
              justifyContent: 'space-between',
              marginVertical: dimensions.height * 0.07,
            }}>

              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  textAlign: "center",
                  fontSize: dimensions.width * 0.053,
                  padding: dimensions.height * 0.01,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase',


                }}
              >
                Result
              </Text>
              <View>
                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    textAlign: "center",
                    fontSize: dimensions.width * 0.053,
                    padding: dimensions.height * 0.01,
                    alignSelf: 'center',
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'uppercase',


                  }}
                >
                  🏆 Final Score:
                </Text>
                <Text style={{
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.055,
                  paddingHorizontal: dimensions.width * 0.07,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase'
                }}>
                  {score} points
                </Text>

              </View>


              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  textAlign: "center",
                  fontSize: dimensions.width * 0.043,
                  padding: dimensions.height * 0.01,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                Tap to menu
              </Text>

            </SafeAreaView>


          </TouchableOpacity>
        </SafeAreaView>
      </Modal>



      <Modal
        animationType="fade"
        transparent={true}
        visible={leaderBoardModalVisible}
        onRequestClose={() => {
          setLeaderBoardModalVisible(!leaderBoardModalVisible);
        }}
      >
        <SafeAreaView style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="light"
            blurAmount={30}
            reducedTransparencyFallbackColor="white"
          />
          <TouchableOpacity
            onPress={() => {
              setLeaderBoardModalVisible(false);
            }}
            style={{
              width: dimensions.width,
              height: dimensions.height,

              borderRadius: dimensions.width * 0.05,

              paddingHorizontal: 0,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <SafeAreaView style={{
              flex: 1,
              justifyContent: 'space-between',
              marginVertical: dimensions.height * 0.07,
            }}>

              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  textAlign: "center",
                  fontSize: dimensions.width * 0.053,
                  padding: dimensions.height * 0.01,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase',


                }}
              >
                Leaderboard
              </Text>
              <View>
                {getTopResults()}
              </View>


              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  textAlign: "center",
                  fontSize: dimensions.width * 0.043,
                  padding: dimensions.height * 0.01,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                Tap to close
              </Text>

            </SafeAreaView>


          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

export default TapPlinkRaceScreen;
