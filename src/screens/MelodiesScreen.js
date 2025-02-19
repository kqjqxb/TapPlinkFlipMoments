import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    Share,
    Alert
} from 'react-native';
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';

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

const MelodiesScreen = ({ setSelectedScreen, selectedScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isMelodyRunned, setIsMelodyRunned] = useState(false)
    const [isCreatingMelodyNow, setIsCreatingMelodyNow] = useState(false)
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [savedMelodies, setSavedMelodies] = useState([]);
    const [playingMelodyNumber, setPlayingMelodyNumber] = useState(0);
    const { volume } = useAudio();



    useEffect(() => {
        const loadSavedMelodies = async () => {
            try {
                const savedMelodies = await AsyncStorage.getItem('SavedMelodies');
                if (savedMelodies) {
                    setSavedMelodies(JSON.parse(savedMelodies));
                }
            } catch (error) {
                console.error('Error loading saved melodies:', error);
            }
        };

        loadSavedMelodies();
    }, [savedMelodies, selectedScreen, isCreatingMelodyNow]);

    useEffect(() => {
        setSelectedButtons([]);
    }, [selectedScreen])


    useEffect(() => {
        console.log('selectedButtons', selectedButtons);
    }, [selectedButtons])

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


    const playSelectedSounds = async () => {

        for (const buttonId of selectedButtons) {
            const button = soundButtons.find((btn) => btn.id === buttonId);
            if (button) {
                await playSoundReplay(button.sound);
            }
        }
    };

    const playMySound = async (savedButtons) => {
        for (const buttonId of savedButtons) {
            const button = soundButtons.find((btn) => btn.id === buttonId);
            if (button) {
                await playSoundReplay(button.sound);
            }
        }
        setIsMelodyRunned(false);
    };


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



    const saveMelody = async () => {
        try {
            const thisSavedMelodies = await AsyncStorage.getItem('SavedMelodies');
            const melodies = thisSavedMelodies ? JSON.parse(thisSavedMelodies) : [];
            const maxNumber = melodies.length > 0 ? Math.max(...melodies.map(melody => melody.number)) : 0;
            const newMelody = {
                number: maxNumber + 1,
                buttons: selectedButtons
            };
            melodies.push(newMelody);
            setSavedMelodies([...savedMelodies, newMelody]);
            await AsyncStorage.setItem('SavedMelodies', JSON.stringify(melodies));
        } catch (error) {
            console.error('Error saving melody:', error);
            Alert.alert('Error', 'Failed to save melody');
        }
    };





    return (
        <SafeAreaView style={{
            display: 'flex',
            alignSelf: 'center',
            width: '100%',
            flex: 1

        }}>
            <TouchableOpacity
                onPress={() => {
                    setSelectedScreen('Home');
                }}

                style={{
                    alignSelf: 'flex-end',
                    marginBottom: dimensions.height * 0.016,
                    marginRight: '8%',
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


            {!isCreatingMelodyNow ? (

                <View>
                    <Text
                        style={{
                            fontFamily: fontLuckiestGuyRegular,
                            textAlign: "center",
                            fontSize: dimensions.width * 0.088,
                            paddingVertical: dimensions.height * 0.01,
                            alignSelf: 'center',
                            fontWeight: 700,
                            color: 'white',


                        }}
                    >
                        Your Melodies
                    </Text>
                    <ScrollView style={{ width: '100%', }}>
                        <View style={{
                            width: '100%',
                            paddingBottom: dimensions.height * 0.35
                        }}>



                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: dimensions.width * 0.057,
                                backgroundColor: '#F9D54D',
                                borderColor: '#e0c14c',
                                width: dimensions.width * 0.4,
                                alignSelf: 'center',
                                width: dimensions.width * 0.88,
                                borderWidth: dimensions.width * 0.01,
                                paddingVertical: dimensions.height * 0.03,
                                paddingHorizontal: dimensions.width * 0.016,
                                marginBottom: dimensions.height * 0.019
                            }}>
                                <Text
                                    style={{
                                        fontFamily: fontSFProRegular,
                                        textAlign: "center",
                                        fontSize: dimensions.width * 0.04,
                                        paddingVertical: dimensions.height * 0.014,
                                        alignSelf: 'center',
                                        fontWeight: 700,
                                        color: 'white',


                                    }}
                                >
                                    Here, you can view, play, and manage all the melodies you've crafted
                                </Text>

                            </View>


                            {savedMelodies.map((melody) => (

                                <TouchableOpacity
                                    key={melody.number}
                                    disabled={isMelodyRunned}
                                    onPress={() => {
                                        setPlayingMelodyNumber(melody.number);
                                        setIsMelodyRunned(!isMelodyRunned);
                                        playMySound(melody.buttons);
                                    }}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderRadius: dimensions.width * 0.057,
                                        backgroundColor: '#F9D54D',
                                        borderColor: '#e0c14c',
                                        width: dimensions.width * 0.4,
                                        alignSelf: 'center',
                                        width: dimensions.width * 0.88,
                                        borderWidth: dimensions.width * 0.01,
                                        paddingVertical: dimensions.height * 0.01,
                                        flexDirection: 'row',
                                        paddingHorizontal: dimensions.width * 0.03,
                                        marginBottom: dimensions.height * 0.01
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: fontLuckiestGuyRegular,
                                            textAlign: "center",
                                            fontSize: dimensions.width * 0.07,
                                            paddingVertical: dimensions.height * 0.004,
                                            alignSelf: 'center',
                                            fontWeight: 700,
                                            color: 'white',


                                        }}
                                    >
                                        Melody {melody.number}
                                    </Text>


                                    <Image
                                        source={(playingMelodyNumber === melody.number && isMelodyRunned) ? require('../assets/icons/pauseIcon.png') : require('../assets/icons/runIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.07,
                                            height: dimensions.width * 0.07,
                                            textAlign: 'center'
                                        }}
                                        resizeMode="contain"
                                    />

                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                </View>
            ) : (
                <View style={{
                    width: '91%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: dimensions.height * 0.16,
                    flex: 1,
                    maxHeight: '93%'

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
                        width: '100%',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: dimensions.height * 0.19
                        }}>
                            <TouchableOpacity
                                onPress={playSelectedSounds}
                                style={{
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
                                <TouchableOpacity key={index} style={{ alignItems: 'center' }}
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
                    if (isCreatingMelodyNow) {
                        saveMelody();
                        setSelectedButtons([]);

                    }
                    setIsCreatingMelodyNow(!isCreatingMelodyNow);
                }}
                disabled={selectedButtons.length === 0 && isCreatingMelodyNow}
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
                    opacity: selectedButtons.length === 0 && isCreatingMelodyNow ? 0.5 : 1,
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
                    {!isCreatingMelodyNow ? 'Create' : 'Save'}
                </Text>

            </TouchableOpacity>


        </SafeAreaView>
    );
};

export default MelodiesScreen;
