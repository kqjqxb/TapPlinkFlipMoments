import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    Alert,
} from 'react-native';
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontLuckiestGuyRegular = 'LuckiestGuy-Regular'
const fontSFProRegular = 'SFProText-Regular'


const soundButtons = [
    {
        id: 1,
        color: '#FD40FD',
        sound: 's1.wav'
    },
    {
        id: 2,
        color: '#F9D447',
        sound: 's2.wav'
    },
    {
        id: 3,
        color: '#8BDD00',
        sound: 's3.wav'
    },
    {
        id: 4,
        color: '#F72401',
        sound: 's4.wav'
    },
    {
        id: 5,
        color: '#A5E0FE',
        sound: 's5.wav'
    },
    {
        id: 6,
        color: '#0F47FF',
        sound: 's6.wav'
    },
    {
        id: 7,
        color: '#CB40FD',
        sound: 's7.wav'
    },
];


const levels = [
    { id: 1, buttons: [2, 5, 4, 3] },
    { id: 2, buttons: [1, 6, 7, 2] },
    { id: 3, buttons: [3, 7, 5, 1] },
    { id: 4, buttons: [4, 6, 2, 7] },
    { id: 5, buttons: [3, 1, 6, 5, 2] },
    { id: 6, buttons: [7, 4, 1, 3, 6] },
    { id: 7, buttons: [2, 5, 7, 4, 1] },
    { id: 8, buttons: [6, 3, 2, 7, 5] },
    { id: 9, buttons: [1, 4, 3, 5, 7, 6] },
    { id: 10, buttons: [2, 6, 7, 1, 4, 5] },
    { id: 11, buttons: [3, 5, 6, 7, 2, 1] },
    { id: 12, buttons: [4, 7, 1, 2, 3, 5] },
    { id: 13, buttons: [5, 3, 7, 1, 2, 6, 4] },
    { id: 14, buttons: [6, 2, 5, 3, 4, 7, 1] },
    { id: 15, buttons: [7, 4, 1, 6, 5, 2, 3] },
    { id: 16, buttons: [1, 7, 6, 3, 2, 4, 5] }
];

const GameScreen = ({ setSelectedScreen, selectedScreen, selectedLevel, setSelectedLevel }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isGameStarted, setIsGameStarted] = useState(true);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [gameResult, setGameResult] = useState('');
    const [selectedButtons, setSelectedButtons] = useState([]);
    const { volume } = useAudio();
    const [isMelodyRunned, setIsMelodyRunned] = useState(false);
    const [isPreparingVisible, setIsPreparingVisible] = useState(true);


    useEffect(() => {
        const updateCompletedLevels = async () => {
            if (gameResult === 'Win') {
                if (selectedLevel < 16) {
                    try {
                        const storedLevels = await AsyncStorage.getItem('completedLevels');
                        let completedLevels = storedLevels ? JSON.parse(storedLevels) : [];

                        if (!completedLevels.includes(selectedLevel + 1)) {
                            completedLevels.push(selectedLevel + 1);
                            await AsyncStorage.setItem('completedLevels', JSON.stringify(completedLevels));
                        }
                    } catch (error) {
                        console.error('Failed to update completed levels:', error);
                    }
                }
            }
        };

        updateCompletedLevels();
    }, [gameResult, selectedLevel]);



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

    useEffect(() => {
        setSelectedButtons([]);
    }, [selectedScreen]);

    const playMySound = async (savedButtons) => {
        for (const buttonId of savedButtons) {
            const button = soundButtons.find((bttn) => bttn.id === buttonId);
            if (button) {
                await playSoundReplay(button.sound);
            }
        }
        setIsMelodyRunned(false);
    };


    useEffect(() => {

        if (selectedButtons.length === levels[selectedLevel - 1].buttons.length) {
            setIsGameFinished(true);
            for (let i = 0; i < selectedButtons.length; i++) {
                if (selectedButtons[i] !== levels[selectedLevel - 1].buttons[i]) {
                    setGameResult('Fail');
                    setIsGameStarted(true);
                    console.log('Fail');
                    return;
                }
            }
            console.log('Win');
            setGameResult('Win');
            setIsGameStarted(true);
            setIsGameFinished(true);
        }
    }, [selectedButtons]);


    const playSoundReplay = (soundFile) => {
        return new Promise((resolve, reject) => {
            const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
                sound.setVolume(volume);
                if (error) {
                    console.log('Помилка при завантаженні файлу:', error);
                    reject(error);
                    return;
                }
                sound.play((success) => {
                    if (!success) {
                        console.log('Помилка при відтворенні звуку');
                        reject(new Error('Помилка при відтворенні звуку'));
                    } else {
                        sound.release();
                        resolve();
                    }
                });
            });
        });
    };

    return (
        <SafeAreaView style={{
            display: 'flex',
            alignSelf: 'center',
            width: '100%',
            flex: 1

        }}>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '91%',
                marginBottom: dimensions.height * 0.016,
                alignSelf: 'center'
            }}>

                <TouchableOpacity
                    onPress={() => {
                        setIsMelodyRunned(true);
                        playMySound(levels[selectedLevel - 1].buttons);
                    }}
                    disabled={isMelodyRunned}
                    style={{


                        borderRadius: dimensions.width * 0.057,
                        backgroundColor: '#F9D447',
                        borderColor: '#e0c14c',
                        paddingVertical: dimensions.width * 0.03,
                        paddingHorizontal: dimensions.width * 0.01,
                        borderWidth: dimensions.width * 0.01,
                    }}>
                    <Image
                        source={require('../assets/images/soundBoxImage.png')}
                        style={{
                            width: dimensions.height * 0.07,
                            height: dimensions.height * 0.07,
                            textAlign: 'center'
                        }}
                        resizeMode="contain"
                    />

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedScreen('Home');
                    }}

                    style={{


                        borderRadius: dimensions.width * 0.057,
                        backgroundColor: '#afe157',
                        borderColor: '#B4D282',
                        paddingVertical: dimensions.width * 0.03,
                        paddingHorizontal: dimensions.width * 0.05,

                        borderWidth: dimensions.width * 0.01,
                    }}>
                    <Image
                        source={require('../assets/icons/homeIcon.png')}
                        style={{
                            width: dimensions.width * 0.061,
                            height: dimensions.width * 0.061,
                            textAlign: 'center'
                        }}
                        resizeMode="contain"
                    />

                </TouchableOpacity>
            </View>


            {isPreparingVisible && isGameStarted && !isGameFinished ? (

                <View style={{
                    marginTop: dimensions.height * 0.19
                }}>
                    <Text
                        style={{
                            fontFamily: fontSFProRegular,
                            textAlign: "center",
                            fontSize: dimensions.width * 0.04,
                            paddingVertical: dimensions.height * 0.01,
                            alignSelf: 'center',
                            fontWeight: 600,
                            color: 'white',
                            paddingHorizontal: dimensions.width * 0.07,
                            paddingBottom: dimensions.height * 0.1


                        }}
                    >
                        I'm Ging, your funky DJ and I need your help to keep the rhythm alive. Here's the deal: I'll play a sequence of sounds. Listen carefully, remember the order, and tap the right buttons to match my beat
                    </Text>


                    <TouchableOpacity
                        onPress={() => {
                            setIsMelodyRunned(true);
                            playMySound(levels[selectedLevel - 1].buttons);
                        }}
                        disabled={isMelodyRunned}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: dimensions.width * 0.057,
                            backgroundColor: '#F9D54D',
                            borderColor: '#e0c14c',
                            width: dimensions.width * 0.4,
                            alignSelf: 'center',
                            width: dimensions.width * 0.88,
                            borderWidth: dimensions.width * 0.01,
                            paddingVertical: dimensions.height * 0.019,
                            paddingHorizontal: dimensions.width * 0.016,
                            marginBottom: dimensions.height * 0.019
                        }}>
                        <Text
                            style={{
                                fontFamily: fontSFProRegular,
                                textAlign: "center",
                                fontSize: dimensions.width * 0.064,
                                paddingVertical: dimensions.height * 0.005,
                                alignSelf: 'center',
                                fontWeight: 700,
                                color: 'white',



                            }}
                        >
                            Listen to the Sequence
                        </Text>
                        <Image
                            source={require('../assets/images/soundBoxImage.png')}
                            style={{
                                width: dimensions.height * 0.07,
                                height: dimensions.height * 0.07,
                                textAlign: 'center',
                                marginTop: dimensions.height * 0.01
                            }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                </View>
            ) : isGameStarted && isGameFinished ? (
                <View style={{
                    marginTop: dimensions.height * 0.16
                }}>
                    <Text
                        style={{
                            fontFamily: fontLuckiestGuyRegular,
                            textAlign: "center",
                            fontSize: dimensions.width * 0.077,
                            paddingVertical: dimensions.height * 0.005,
                            alignSelf: 'center',
                            fontWeight: 700,
                            color: 'white',



                        }}
                    >
                        {gameResult === 'Win' ? 'Level Complete!' : 'Level Failed'}
                    </Text>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: dimensions.width * 0.057,
                        // backgroundColor: '#F9D54D',
                        backgroundColor: gameResult === 'Win' ? '#F9D54D' : '#F72401',
                        borderColor: gameResult === 'Win' ? '#e0c14c' : 'rgba(206,98,80,255)',
                        width: dimensions.width * 0.4,
                        alignSelf: 'center',
                        width: dimensions.width * 0.88,
                        borderWidth: dimensions.width * 0.01,
                        paddingVertical: dimensions.height * 0.019,
                        paddingHorizontal: dimensions.width * 0.016,
                        marginBottom: dimensions.height * 0.019
                    }}>
                        <Text
                            style={{
                                fontFamily: fontSFProRegular,
                                textAlign: "center",
                                fontSize: dimensions.width * 0.043,
                                paddingVertical: dimensions.height * 0.005,
                                alignSelf: 'center',
                                fontWeight: 700,
                                color: 'white',
                                marginBottom: dimensions.height * 0.014



                            }}
                        >
                            Woohoo! You nailed it! The crowd’s loving your vibe, and Ging’s ready to turn it up a notch. Get ready for the next level!
                        </Text>

                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedScreen('Home')
                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: dimensions.width * 0.057,

                                    borderColor: gameResult !== 'Win' ? 'white' : '#456E00',
                                    width: dimensions.width * 0.4,
                                    alignSelf: 'center',

                                    borderWidth: dimensions.width * 0.01,
                                }}>
                                <Text
                                    style={{
                                        fontFamily: fontLuckiestGuyRegular,
                                        textAlign: "center",
                                        fontSize: dimensions.width * 0.05,
                                        alignSelf: 'center',
                                        fontWeight: 800,
                                        color: gameResult !== 'Win' ? 'white' : '#456E00',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: dimensions.width * 0.03,
                                    }}
                                >
                                    Menu
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={async () => {
                                    if (gameResult === 'Win') {
                                        if (selectedLevel < 16) {
                                            try {
                                                const storedLevels = await AsyncStorage.getItem('completedLevels');
                                                let completedLevels = storedLevels ? JSON.parse(storedLevels) : [];

                                                if (!completedLevels.includes(selectedLevel + 1)) {
                                                    completedLevels.push(selectedLevel + 1);
                                                    await AsyncStorage.setItem('completedLevels', JSON.stringify(completedLevels));
                                                }
                                            } catch (error) {
                                                console.error('Failed to update completed levels:', error);
                                            }
                                            setSelectedLevel(selectedLevel + 1);

                                        } else {
                                            setSelectedLevel(1);

                                        }
                                    }
                                    setIsPreparingVisible(true);
                                    setSelectedButtons([]);
                                    setIsGameStarted(true);
                                    setIsGameFinished(false);
                                    setGameResult('');

                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: dimensions.width * 0.057,
                                    backgroundColor: '#afe157',
                                    borderColor: '#B4D282',
                                    alignSelf: 'center',
                                    width: dimensions.width * 0.4,
                                    borderWidth: dimensions.width * 0.01,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: fontLuckiestGuyRegular,
                                        textAlign: "center",
                                        fontSize: dimensions.width * 0.05,
                                        alignSelf: 'center',
                                        fontWeight: 800,
                                        color: 'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: dimensions.width * 0.03,
                                    }}
                                >
                                    {gameResult === 'Win' ? 'Next level' : 'Retry'}
                                </Text>

                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            ) : (
                <View style={{
                    width: '91%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1,
                    paddingBottom: dimensions.height * 0.16

                }}>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        marginTop: dimensions.height * 0.07
                    }}>

                        {selectedButtons.map((button, index) => (
                            <View key={index} style={{ alignItems: 'center' }}>
                                <View style={{
                                    height: dimensions.height * 0.12,
                                    width: dimensions.width * 0.121,
                                    backgroundColor: soundButtons.find((soundButton) => soundButton.id === button).color,
                                    borderRadius: dimensions.width * 0.03,
                                    marginHorizontal: dimensions.width * 0.005
                                }} />
                            </View>
                        ))}
                    </View>


                    <View style={{
                        width: '100%'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                disabled={true}
                                onPress={() => {

                                }}
                                style={{
                                    opacity: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: dimensions.width * 0.057,
                                    backgroundColor: '#F9D447',
                                    borderColor: '#e0c14c',
                                    width: dimensions.width * 0.68,
                                    alignSelf: 'center',

                                    borderWidth: dimensions.width * 0.01,
                                }}>
                                <Text
                                    style={{
                                        fontFamily: fontLuckiestGuyRegular,
                                        textAlign: "center",
                                        fontSize: dimensions.width * 0.064,
                                        alignSelf: 'center',
                                        fontWeight: 800,
                                        color: 'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: dimensions.width * 0.03,
                                    }}
                                >
                                    Listen to
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedButtons([]);
                                }}

                                style={{
                                    alignSelf: 'flex-end',
                                    borderRadius: dimensions.width * 0.057,
                                    backgroundColor: '#afe157',
                                    borderColor: '#B4D282',
                                    paddingVertical: dimensions.width * 0.03,
                                    paddingHorizontal: dimensions.width * 0.05,

                                    borderWidth: dimensions.width * 0.01,
                                }}>
                                <Image
                                    source={require('../assets/icons/deleteIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.061,
                                        height: dimensions.width * 0.061,
                                        textAlign: 'center'
                                    }}
                                    resizeMode="contain"
                                />

                            </TouchableOpacity>

                        </View>


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            marginTop: dimensions.height * 0.025
                        }}>
                            {soundButtons.map((button, index) => (
                                <TouchableOpacity key={index} style={{ alignItems: 'center' }} disabled={isMelodyRunned}
                                    onPress={() => {
                                        if (selectedButtons.length < 7) {
                                            setSelectedButtons([...selectedButtons, button.id])
                                            playSound(button.sound);
                                        }
                                        else {
                                            Alert.alert('Error', 'You can select only 7 buttons');
                                        }
                                    }}
                                >
                                    <View style={{
                                        height: dimensions.height * 0.19,
                                        width: dimensions.width * 0.121,
                                        backgroundColor: button.color,
                                        borderRadius: dimensions.width * 0.03,
                                        marginHorizontal: dimensions.width * 0.005
                                    }} />
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>


                </View>
            )}

            <TouchableOpacity
                onPress={() => {
                    setIsPreparingVisible(!isPreparingVisible);
                    setIsGameStarted(!isGameStarted);
                }}
                disabled={isGameStarted && isGameFinished}
                style={{
                    position: 'absolute',
                    bottom: dimensions.height * 0.04,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: dimensions.height * 0.021,
                    borderRadius: dimensions.width * 0.057,
                    backgroundColor: '#afe157',
                    borderColor: '#65862b',
                    width: dimensions.width * 0.8,
                    alignSelf: 'center',
                    opacity: isGameStarted && isGameFinished ? 0 : 1,
                    borderWidth: dimensions.width * 0.01,
                }}>
                <Text
                    style={{
                        fontFamily: fontLuckiestGuyRegular,
                        textAlign: "center",
                        fontSize: dimensions.width * 0.064,
                        alignSelf: 'center',
                        fontWeight: 800,
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: dimensions.width * 0.03,
                    }}
                >
                    {isPreparingVisible ? 'Start' : 'Back'}
                </Text>

            </TouchableOpacity>


        </SafeAreaView>
    );
};

export default GameScreen;
