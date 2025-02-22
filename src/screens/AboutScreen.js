import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const fontPoppinsRegular = 'Poppins-Regular';

const AboutScreen = ({ setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

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
            setSelectedScreen('Home');
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
            right: dimensions.width * 0.005,
            alignSelf: 'center',
            fontWeight: 600,
            color: 'white',
            textTransform: 'uppercase'

          }}
        >
          About
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

      <ScrollView >
        <View style={{
          marginTop: dimensions.height * 0.03,
          paddingBottom: dimensions.height * 0.16,
        }}>
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
                fontSize: dimensions.width * 0.041,
                paddingHorizontal: 21,
                color: 'rgba(255, 255, 255, 1)',
                textAlign: 'left',
                fontWeight: 300,
              }}>
              Tap Plink Flip Moments is a fast-paced party game that brings fun, precision, and challenges for solo players and groups! Whether you're testing your timing and accuracy in a color-matching race or guessing words in a hilarious party challenge, this game will keep you engaged.
            </Text>
          </View>

          <View style={{
            alignItems: 'center',
            zIndex: 0,
            width: dimensions.width * 0.93,
            alignSelf: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: dimensions.width * 0.05,
            paddingVertical: dimensions.height * 0.025,
            paddingBottom: dimensions.height * 0.03,
            marginTop: dimensions.height * 0.03,
          }}>
            <Text
              style={{
                fontFamily: fontPoppinsRegular,
                textAlign: "left",
                fontSize: dimensions.width * 0.043,
                alignSelf: 'center',
                fontWeight: 500,
                color: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: dimensions.width * 0.05,

              }}
            >
              🎭 Flip & Guess – A party game full of surprises! Take turns guessing words with a fun twist{'\n'}
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
              🔄 Random challenge generator – Sing, Act, or Answer Yes/No questions!{'\n'}
              📝 Choose a category or mix them all for more fun!{'\n'}
              🎤 Race against the timer and score points for correct guesses!{'\n'}
              🎉 Perfect for game nights and parties!
            </Text>
          </View>

          <View style={{
            alignItems: 'center',
            zIndex: 0,
            width: dimensions.width * 0.93,
            alignSelf: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: dimensions.width * 0.05,
            paddingVertical: dimensions.height * 0.025,
            paddingBottom: dimensions.height * 0.03,
            marginTop: dimensions.height * 0.03,

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
              🏁 Plink Race – A fast-paced reaction game where precision and timing are key!{'\n'}
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
              🎯 Hold and release at the right moment to stop the moving slider on the correct color.{'\n'}
              🔄 Your triangle spins while the slider moves back and forth—stay focused!{'\n'}
              ⏳ React quickly and hit the target color to score points!{'\n'}
              🏆 Keep going even if you miss—the race never stops!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
