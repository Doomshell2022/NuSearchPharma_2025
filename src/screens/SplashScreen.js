import React, {PureComponent} from 'react';
import {View, Animated, StyleSheet, ImageBackground, Text} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import spash_screen_bg from '../assets/images/spash_screen_bg.png';
// import logo_splash_2 from '../assets/images/logo_splash_2.png';
import logo from '../assets/images/logo.png';

export default class SplashScreen extends PureComponent {
  state = {
    opacity: new Animated.Value(0),
  };

  handleAnimation = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const animatedImageStyle = [
      {
        opacity: this.state.opacity,
        transform: [
          {
            scale: this.state.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
        ],
      },
      styles.logo,
    ];

    return (
      <>
        <ImageBackground
          source={spash_screen_bg}
          resizeMode="cover"
          style={basicStyles.container}>
          <View
            style={[
              basicStyles.mainContainer,
              basicStyles.alignCenter,
              basicStyles.justifyCenter,
            ]}>
            <View style={styles.logContainer}>
              <Animated.Image
                source={logo}
                resizeMode="cover"
                onLoad={this.handleAnimation}
                style={animatedImageStyle}
              />
            </View>
          </View>
        </ImageBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: hp(18),
    aspectRatio: 3 / 2,
  },
  logContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
});
