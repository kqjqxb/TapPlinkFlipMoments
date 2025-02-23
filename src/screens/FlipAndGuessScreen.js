import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  TextInput,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import funnyWordsData from '../components/funnyWordsData';
import famousPeopleData from '../components/famousPeopleData';
import moviesAndTVData from '../components/moviesAndTVData';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';

const allData = [...funnyWordsData, ...famousPeopleData, ...moviesAndTVData];

const fontPoppinsRegular = 'Poppins-Regular';

const categoies = [
  {
    id: 1,
    title: 'All Categories'
  },
  {
    id: 2,
    title: 'Movies & TV'
  },
  {
    id: 3,
    title: 'Funny Words'
  },
  {
    id: 4,
    title: 'Famous People'
  },

]

const FlipAndGuessScreen = ({ setSelectedScreen, selectedScreen, isVibrationEnabled, isSoundEnabled }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [playersAmount, setPlayersAmount] = useState(2);
  const [players, setPlayers] = useState(Array(playersAmount).fill(''));
  const [isPlayersWasVisible, setIsPlayersWasVisible] = useState(false);
  const [isCategoriesWasVisible, setIsCategoriesWasVisible] = useState(false);
  const [isGameWasStarted, setIsGameWasStarted] = useState(false);
  const [isGameWasFinished, setIsGameWasFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [flipAnim] = useState(new Animated.Value(0));


  const [scores, setScores] = useState(Array(players.length).fill(0));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);


  const { volume } = useAudio();
  const sound = 'sound.wav'

  Sound.setCategory('Playback');

  const playSound = (soundFile) => {
    const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
      sound.setVolume(volume);
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

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [
      { rotateY: frontInterpolate }
    ]
  };

  const backAnimatedStyle = {
    transform: [
      { rotateY: backInterpolate }
    ]
  };


  const flipCard = () => {
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
    });
  };



  const handleNextWord = () => {
    flipCard();
    if (usedWords.length === data.length) {
      setIsGameWasFinished(true);
      return;
    }

    let newWord;
    do {
      newWord = data[Math.floor(Math.random() * data.length)];
    } while (usedWords.includes(newWord.id));

    setUsedWords([...usedWords, newWord.id]);
    setCurrentWord(newWord);
  };

  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  const handleSkipFlip = () => {
    if (isVibrationEnabled) {
      ReactNativeHapticFeedback.trigger("impactMedium", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    handleNextWord();
    handleNextPlayer();
  };

  const handleGuessed = () => {
    if (isSoundEnabled) playSound(sound);
    if (isVibrationEnabled) {
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    setScores((prevScores) => {
      const newScores = [...prevScores];
      newScores[currentPlayerIndex] += 1;
      return newScores;
    });
    handleNextWord();
    handleNextPlayer();
  };

  const getDataByCategory = (category) => {
    switch (category) {
      case 'All Categories':
        return allData;
      case 'Movies & TV':
        return moviesAndTVData;
      case 'Funny Words':
        return funnyWordsData;
      case 'Famous People':
        return famousPeopleData;
      default:
        return [];
    }
  };

  const data = getDataByCategory(selectedCategory);

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
    setPlayers(prev => {
      const updated = Array(playersAmount)
        .fill('')
        .map((_, i) => prev[i] ?? '');
      return updated;
    });
  }, [playersAmount]);


  useEffect(() => {
    setPlayers(prev => {
      const updated = Array(playersAmount)
        .fill('')
        .map((_, i) => prev[i] ?? '');
      return updated;
    });

    setScores(prev => {
      const updated = Array(playersAmount)
        .fill(0)
        .map((_, i) => prev[i] ?? 0);
      return updated;
    });
  }, [playersAmount]);


  const handleEndGame = () => {
    setIsGameWasFinished(false);
    setIsGameWasStarted(false);
    setUsedWords([]);
    setIsCategoriesWasVisible(false);
    setIsPlayersWasVisible(false);
    setPlayers(Array(playersAmount).fill(''));
    setSelectedCategory('All Categories');
    setCurrentPlayer(0);
    setCurrentWord('');
    setScores(Array(playersAmount).fill(0));
    setCurrentPlayerIndex(0);
    setPlayersAmount(2);
  };


  const sortedPlayers = players
    .map((player, index) => ({ name: player, score: scores[index] }))
    .sort((a, b) => b.score - a.score);

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
            if (isPlayersWasVisible) {
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
          Flip & Guess
        </Text>

        <TouchableOpacity
          disabled={true}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: dimensions.height * 0.023,
            borderRadius: dimensions.height * 0.03,
            opacity: 0
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


      {!isCategoriesWasVisible && (
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
            Enter player names and take turns guessing! The game will decide whether you sing, act, or answer with Yes/No!
          </Text>

        </View>
      )}


      {!isPlayersWasVisible && !isCategoriesWasVisible && !isGameWasStarted ? (
        <>
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
              marginTop: dimensions.height * 0.03

            }}
          >
            Players
          </Text>

          <View style={{
            width: dimensions.width * 0.9,
            alignItems: 'center',
            justifyContent: 'center',
          }}>

            {players.map((player, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: dimensions.width * 0.9,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.01,
              }}>
                <TouchableOpacity
                  disabled={playersAmount === 2}
                  onPress={() => {
                    setPlayers(prev => {
                      const updated = [...prev];
                      updated.splice(index, 1);
                      return updated;
                    });
                    setPlayersAmount(prev => prev - 1);
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: dimensions.height * 0.019,
                    borderRadius: dimensions.height * 0.025,
                    paddingHorizontal: dimensions.width * 0.043,
                    maxWidth: dimensions.width * 0.16,

                  }}>
                  <Image
                    source={require('../assets/icons/xIcon.png')}
                    style={{
                      width: dimensions.height * 0.022,
                      height: dimensions.height * 0.022,
                      textAlign: 'center'
                    }}
                    resizeMode="contain"
                  />

                </TouchableOpacity>

                <TextInput
                  placeholder={`Player ${index + 1}`}
                  value={player}
                  onChangeText={val => {
                    setPlayers(all => {
                      const copy = [...all];
                      copy[index] = val;
                      return copy;
                    });
                  }}
                  placeholderTextColor="rgba(255, 255, 255, 0.61)"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: dimensions.width * 0.035,
                    paddingHorizontal: dimensions.width * 0.05,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: dimensions.width * 0.055,
                    width: dimensions.width * 0.741,

                    color: 'white',
                    fontFamily: fontPoppinsRegular,
                    fontSize: dimensions.width * 0.041,
                    fontWeight: 300,
                    textAlign: 'left',

                  }}
                />
              </View>
            ))}
          </View>
        </>
      ) : isPlayersWasVisible && !isCategoriesWasVisible && !isGameWasStarted ? (
        <>
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
              marginTop: dimensions.height * 0.03

            }}
          >
            Category
          </Text>

          <View style={{
            width: dimensions.width * 0.9,
            alignItems: 'center',
            justifyContent: 'center',
          }}>

            {categoies.map((category, index) => (

              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedCategory(category.title);
                }}
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: dimensions.height * 0.01,
                  borderRadius: dimensions.width * 0.5,
                  paddingVertical: dimensions.width * 0.03,
                  width: dimensions.width * 0.93,
                  backgroundColor: selectedCategory === category.title ? 'rgba(12, 132, 167, 1)' : 'rgba(0, 0, 0, 0.7)',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingHorizontal: dimensions.width * 0.07,
                }}
              >
                <Image
                  source={require('../assets/icons/checkIcon.png')}
                  style={{
                    width: dimensions.height * 0.03,
                    height: dimensions.height * 0.03,
                    textAlign: 'center'
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.044,
                    textAlign: 'center',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    padding: dimensions.width * 0.01,
                    left: dimensions.width * 0.03,
                  }}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={{
          flex: 1,
          position: 'relative',
        }}>
          <TouchableOpacity
            disabled={isGameWasStarted}
            onPress={() => {
              setIsGameWasStarted(true);
              handleNextWord();
            }} style={{
              flex: 1,
              width: dimensions.width,
            }}>

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
              it's {players[currentPlayerIndex]}'s turn!
            </Text>



            {!isGameWasStarted ? (
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
                  position: 'absolute',
                  bottom: dimensions.height * 0.05,
                }}
              >
                Tap to start
              </Text>
            ) : (
              <View>
                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    textAlign: "center",
                    fontSize: dimensions.width * 0.068,
                    padding: dimensions.height * 0.01,
                    right: dimensions.width * 0.0088,
                    alignSelf: 'center',
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'uppercase',
                    marginTop: dimensions.height * 0.03,

                  }}
                >
                  {currentWord.id > 0 && currentWord.id < 16 ? '🌍 Famous People' : currentWord.id >= 16 && currentWord.id < 31 ? '😂 Funny Words' : '🎬 Movies & TV'}
                </Text>

                <Animated.View style={{
                  marginTop: dimensions.height * 0.05,
                  width: dimensions.width * 0.631,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  borderRadius: dimensions.width * 0.05,
                  borderColor: 'white',
                  borderWidth: dimensions.width * 0.007,
                  height: dimensions.height * 0.48,
                  backfaceVisibility: 'hidden',
                  ...frontAnimatedStyle
                }}>
                  <Text style={{
                    fontFamily: fontPoppinsRegular,
                    textAlign: "center",
                    fontSize: dimensions.width * 0.053,
                    padding: dimensions.height * 0.01,
                    right: dimensions.width * 0.0088,
                    alignSelf: 'center',
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'uppercase',
                  }}>
                    {currentWord.title}
                  </Text>

                  {currentWord.id >= 16 && currentWord.id < 31 && (
                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        textAlign: "center",
                        fontSize: dimensions.width * 0.034,
                        padding: dimensions.height * 0.01,
                        right: dimensions.width * 0.0088,
                        alignSelf: 'center',
                        fontWeight: 600,
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      ({currentWord.meaning})
                    </Text>
                  )}
                </Animated.View>
                <Animated.View style={{
                  marginTop: dimensions.height * 0.05,
                  width: dimensions.width * 0.631,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  borderRadius: dimensions.width * 0.05,
                  borderColor: 'white',
                  borderWidth: dimensions.width * 0.007,
                  height: dimensions.height * 0.48,
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  top: dimensions.height * 0.086,
                  ...backAnimatedStyle
                }}>
                  <Text style={{
                    fontFamily: fontPoppinsRegular,
                    textAlign: "center",
                    fontSize: dimensions.width * 0.053,
                    padding: dimensions.height * 0.01,
                    right: dimensions.width * 0.0088,
                    alignSelf: 'center',
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'uppercase',
                  }}>
                    {currentWord.title}
                  </Text>
                </Animated.View>


              </View>
            )}
          </TouchableOpacity>



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
        {!isPlayersWasVisible && !isCategoriesWasVisible && !isGameWasStarted && (
          <TouchableOpacity
            disabled={playersAmount === 4}
            onPress={() => {
              setPlayersAmount((prev) => prev + 1);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: dimensions.height * 0.023,
              borderRadius: dimensions.height * 0.035,
              paddingHorizontal: dimensions.width * 0.055,
              maxWidth: dimensions.width * 0.16,
              marginTop: dimensions.height * 0.03,
            }}>

            <Image
              source={require('../assets/icons/plusImageIcon.png')}
              style={{
                width: dimensions.height * 0.028,
                height: dimensions.height * 0.028,
                textAlign: 'center'
              }}
              resizeMode="contain"
            />

          </TouchableOpacity>
        )}


        {isPlayersWasVisible && isCategoriesWasVisible && isGameWasStarted && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            width: dimensions.width * 0.9,
            paddingHorizontal: dimensions.width * 0.03,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={handleSkipFlip}
              style={{
                backgroundColor: '#FF3B30',
                padding: dimensions.width * 0.023,
                width: dimensions.width * 0.4,
                borderRadius: dimensions.height * 0.5,

              }}>
              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  textAlign: "center",
                  fontSize: dimensions.width * 0.04,
                  padding: dimensions.height * 0.005,
                  right: dimensions.width * 0.0088,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase',


                }}
              >
                skip flip
              </Text>

            </TouchableOpacity>


            <TouchableOpacity
              onPress={handleGuessed}
              style={{
                backgroundColor: '#34C759',
                padding: dimensions.width * 0.023,
                width: dimensions.width * 0.4,
                borderRadius: dimensions.height * 0.5,

              }}>
              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  textAlign: "center",
                  fontSize: dimensions.width * 0.04,
                  padding: dimensions.height * 0.005,
                  right: dimensions.width * 0.0088,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase',


                }}
              >
                Guessed
              </Text>

            </TouchableOpacity>
          </View>
        )}


        {!isCategoriesWasVisible && (

          <TouchableOpacity
            onPress={() => {
              if (!isPlayersWasVisible && !isCategoriesWasVisible && !isGameWasStarted) {
                setIsPlayersWasVisible(true);
              } else if (isPlayersWasVisible && !isCategoriesWasVisible && !isGameWasStarted) {
                setIsCategoriesWasVisible(true);
              } else setIsGameWasStarted(true);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: dimensions.height * 0.021,
              borderRadius: dimensions.height * 0.035,
              paddingHorizontal: dimensions.width * 0.055,
              maxWidth: !isPlayersWasVisible && !isCategoriesWasVisible && !isGameWasStarted ? dimensions.width * 0.725 : dimensions.width * 0.9,
              flex: 1,
              marginTop: dimensions.height * 0.03,
              opacity: players.every(player => player.trim() !== '') ? 1 : 0.7,
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
              next
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
                  fontWeight: 400,
                }}>
                  Stay here
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
                  alignSelf: 'center',
                  paddingVertical: dimensions.height * 0.02,
                  width: '44%',
                }}
                onPress={handleExit}
              >
                <Text style={{
                  color: '#FF3B30',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                }}>
                  Exit to Menu
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
          setModalVisible(!modalVisible);
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
                Results
              </Text>
              <View>
                {sortedPlayers.map((player, index) => (
                  <View key={index} style={{ marginTop: index > 0 ? dimensions.height * 0.03 : 0 }}>
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
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : ''} {player.name}
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
                      {player.score} points
                    </Text>
                  </View>
                ))}
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

    </SafeAreaView>
  );
};

export default FlipAndGuessScreen;
